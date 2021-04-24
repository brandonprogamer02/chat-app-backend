import { RequestHandler } from "express";
import { ICreateUserAndTokenJWT, IUser, IUserSign } from "../../../types";
import { verifyIfExistFaceAndIfIsBelongToOtherUser, saveImageStorage } from '../../../facialRecognition/utils'
import UserModel from "../../../models/UserModel";
import { createUserAndTokenJWT } from "../../../auth";

const signController: RequestHandler = async (req, res, next): Promise<void> => {

     const { username, password, userLogImage }: IUserSign = req.body;
     // validations
     if (!username) res.status(400).send('The property "username" has not been provided');
     else if (!password) res.status(400).send('The property "password" has not been provided');
     else {

          const resFacialRecognition = await verifyIfExistFaceAndIfIsBelongToOtherUser(userLogImage);
          // if do not match continue
          if (!resFacialRecognition) {
               // create the user and token
               const resJWT: ICreateUserAndTokenJWT = await createUserAndTokenJWT({ username, password, userLogImage });
               const userId = resJWT.userCreated._id as string;
               saveImageStorage(userLogImage, userId);
               // response to client
               res.json(resJWT.token);
          } else {
               res.status(400).send('allready there is a user with your face registered');
          }
     }

}




export default signController;