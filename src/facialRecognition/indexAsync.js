import * as faceapi from 'face-api.js';
import path from 'path';
import canvas, { Canvas, Image } from 'canvas';
import fs from 'fs';

function loadInputImage(callback) {
     faceapi.env.monkeyPatch({ Canvas, Image });
     const img = canvas.loadImage(inputImage).then(() => callback(img));

}


export async function facialReconitionWithStorageImage(inputImage) {
     const MODEL_URL = path.join(__dirname, './models');

     try {
          // loading models 
          Promise.all([
               faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
               faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
               faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
          ])
               .then(() => {
                    // loading input images
                    faceapi.env.monkeyPatch({ Canvas, Image });
                    canvas.loadImage(inputImage)
                         .then(img => {
                              console.log('ya cargo imagen de input');
                              Promise.all([
                                   faceapi.detectAllFaces(img),
                                   withFaceLandmarks(),
                                   withFaceDescriptors()
                              ])
                                   .then(fullFaceDescriptions => {
                                        // getting name of all user's faceImages
                                        fs.readdir(
                                             path.join(__dirname, 'userFaces'),
                                             function (labels) {
                                                  console.log('ya leyo los label');
                                                  const res = labels.map(label => {
                                                       const urlImg = path.join(__dirname, `userFaces/${label}`);
                                                       const img = await canvas.loadImage(urlImg);
                                                       // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                                                       
                                                            faceapi.detectSingleFace(img).
                                                            withFaceLandmarks().
                                                            withFaceDescriptor()
                                                            .then(fullFaceDescription => {
                                                                 // if (!fullFaceDescription) {
                                                                 //      throw new Error(`no faces detected for ${label}`);
                                                                 // }

                                                                 const faceDescriptors = [fullFaceDescription.descriptor];
                                                                 return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);

                                                            })

                                                  })


                                                  Promise.all(res)
                                                       .then(labeledFaceDescriptors => {

                                                       })




                                             });

                                   })


                         })

               })
     } catch (error) {
          console.log(error);
     }


     // getting array with all face user images knowed
     console.log('ya recorrio los labels')
     console.log('facial recognition finished');
     // matching faceusers rendered with input image
     const maxDescriptorDistance = 0.6;
     try {
          const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

          const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor));
          return results;
     } catch (error) {
          return null;
     }


}



