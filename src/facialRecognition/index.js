import * as faceapi from 'face-api.js';
import path from 'path';
import canvas, { Canvas, Image } from 'canvas';
import fs from 'fs';

export async function facialReconitionWithStorageImage(inputImage) {
     const MODEL_URL = path.join(__dirname, './models');

     try {
          await Promise.all([
               faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
               faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
               faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
          ]);
          // loading models 
          console.log('ya cargo modelos')
     } catch (error) {
          console.log(error);
     }

     // loading input images

     faceapi.env.monkeyPatch({ Canvas, Image });
     const img = await canvas.loadImage(inputImage);

     console.log('ya cargo imagen')
     let fullFaceDescriptions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()

     // id do not detect face
     if (fullFaceDescriptions.length == 0) {
          console.error('face no detected, facial recognition finished')
          return {
               facesDetecting: 0,
               dataRecognition: null
          }
     }
     // getting name of all user's faceImages
     const labels = fs.readdirSync(path.join(__dirname, 'userFaces'));
     // getting array with all face user images knowed
     console.log('ya leyo los label')
     const labeledFaceDescriptors = await Promise.all(
          labels.map(async label => {
               try {
                    const urlImg = path.join(__dirname, `userFaces/${label}`);
                    const img = await canvas.loadImage(urlImg);
                    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                    // if (!fullFaceDescription) {
                    //      throw new Error(`no faces detected for ${label}`);
                    // }
                    console.log(fullFaceDescription);
                    const faceDescriptors = [fullFaceDescription.descriptor];
                    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
               } catch (error) {
                    console.log(error);
               }
          })
     );
     console.log('ya recorrio los labels')
     // matching faceusers rendered with input image
     const maxDescriptorDistance = 0.6;
     try {
          const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

          const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor));

          console.log('facial recognition finished');
          return ({
               facesDetecting: results.length,
               dataRecognition: results
          });
     } catch (error) {
          console.log('facial recognition finished');
          return ({
               facesDetecting: fullFaceDescriptions.length,
               dataRecognition: null
          });
     }


}



