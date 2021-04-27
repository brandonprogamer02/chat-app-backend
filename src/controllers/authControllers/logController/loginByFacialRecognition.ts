import { verifyIfExistFaceAndIfIsBelongToOtherUser } from "../../../facialRecognition/utils";
import { ILogFacialRecognition, IUser } from "../../../types";
import UserModel from "../../../models/UserModel";
import { Response } from "express";
import { createTokenJWT } from "../../../auth";

export default async function (resource: ILogFacialRecognition, res: Response) {
     try {
          const response = await verifyIfExistFaceAndIfIsBelongToOtherUser(resource.base64image);
          if (response.facesDetecting == 0) {
               res.json({ username: null, faceDetecting: false });
          } else if (!response.dataRecognition && response.facesDetecting > 0) {
               res.json({ username: null, faceDetecting: true });
          } else if (response.dataRecognition) {
               response.dataRecognition.forEach(async el => {
                    const id = el.label;
                    // removing the .png to get just the userId
                    const idFormated = id.substring(0, id.length - 4);
                    if (idFormated) {
                         const userWithThisId = await UserModel.findById(idFormated) as unknown as IUser;
                         const { token } = await createTokenJWT({ username: userWithThisId.username, password: userWithThisId.password });
                         console.log(token);
                         if (token) {
                              res.json({ username: userWithThisId.username, token, faceDetecting: true });
                         } else {
                              res.json({ username: null, token: null, faceDetecting: true });
                         }
                    }
               });
          }

     } catch (error) {
          console.log(error.message ? error.message : error);
          res.status(400).send(error.message);
     }
}
