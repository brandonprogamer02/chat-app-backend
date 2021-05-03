import { IUser } from "../../../types";
import UserModel from "../../../models/UserModel";
import { Response } from "express";
import { createTokenJWT } from "../../../auth";
import { facialReconitionWithStorageImage } from "../../../facialRecognition";

export default async function (base64image: string, res: Response) {
     try {
          const response = await facialReconitionWithStorageImage(base64image);

          if (response.facesDetecting == 0) {
               res.json({ username: null, faceDetecting: false });
          } else if (!response.dataRecognition && response.facesDetecting > 0) {
               res.json({ username: null, faceDetecting: true });
          } else if (response.dataRecognition) {
               response.dataRecognition.forEach(async (el: any) => {
                    const userWithThisId = await UserModel.find({ username: el._label }) as unknown as IUser[];
                    
                    const { token } = await createTokenJWT({ username: userWithThisId[0].username, password: userWithThisId[0].password });
                    console.log(token);
                    if (token) {
                         res.json({ username: userWithThisId[0].username, token, faceDetecting: true });
                    } else {
                         res.json({ username: null, token: null, faceDetecting: true });
                    }

               });
          }

     } catch (error) {
          console.log(error.message ? error.message : error);
          res.status(400).send(error.message);
     }
}
