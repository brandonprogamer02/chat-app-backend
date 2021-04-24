import path from "path";
import { verifyIfExistFaceAndIfIsBelongToOtherUser } from "../../../facialRecognition/utils";
import { ILogFacialRecognition, IUser } from "../../../types";
import fs from 'fs';
import UserModel from "../../../models/UserModel";
import { Response } from "express";
import { createTokenJWT } from "../../../auth";

export default async function (resource: ILogFacialRecognition, res: Response) {
     try {
          const response = await verifyIfExistFaceAndIfIsBelongToOtherUser(resource.base64image);
          if (response) {
               
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
     } catch (error) {
          console.log(error.message ? error.message : error);
          res.json({ username: null });
     }
}
