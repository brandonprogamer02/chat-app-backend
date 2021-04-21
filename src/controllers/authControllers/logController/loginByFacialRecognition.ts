import path from "path";
import { facialReconitionWithStorageImage } from "../../../facialRecognition";
import { ILogFacialRecognition, IUser } from "../../../types";
import fs from 'fs';
import UserModel from "../../../models/UserModel";
import { Response } from "express";
import { createTokenJWT } from "../../../auth";


export default async function (resource: ILogFacialRecognition, res: Response) {
     const response = await facialRecognitionProcess(resource);
     console.log(response);
     if (response.length > 0) {

          response.forEach(async el => {
               const id = el.label;
               // removing the .png to get just the userId
               const idFormated = id.substring(0, id.length - 4);
               if (idFormated) {
                    const userWithThisId = await UserModel.findById(idFormated) as unknown as IUser;
                    const { token } = await createTokenJWT({ username: userWithThisId.username, password: userWithThisId.password });
                    console.log(token);
                    if (token) {
                         res.json({ username: userWithThisId.username, token });
                    } else {
                         res.json({ username: null, token: null });
                    }
               }
          });
     } else {
          res.json({ username: null });
     }
}


// facial recognition process
async function facialRecognitionProcess(arg0: ILogFacialRecognition) {
     const { userId, base64image } = arg0;
     // to declare some path to store your converted image
     const _path = path.join(__dirname, 'uploadTemp', `${userId}.png`);
     console.log(_path);
     // to convert base64 format into random filename
     const base64Data = base64image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

     // save image
     fs.writeFileSync(_path, base64Data, { encoding: 'base64' });
     // the image is saved, now active the facial recognition system
     const res1 = await facialReconitionWithStorageImage(_path);
     // delete the image
     fs.unlinkSync(_path);
     return res1;
}