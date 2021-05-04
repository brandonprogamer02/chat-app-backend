import { RequestHandler } from "express";
import { ICreateUserAndTokenJWT, IUser, IUserSign } from "../../../types";
import { createUserAndTokenJWT } from "../../../auth";

const signController: RequestHandler = async (req, res, next): Promise<void> => {

     const { username, password, userLogImage }: IUserSign = req.body;
     // validations
     if (!username) res.status(400).send('The property "username" has not been provided');
     else if (!password) res.status(400).send('The property "password" has not been provided');
     else {

          // const { dataRecognition, facesDetecting } = await verifyIfExistFaceAndIfIsBelongToOtherUser(userLogImage);
          const { token, userCreated }: ICreateUserAndTokenJWT = await createUserAndTokenJWT({ username, password, userLogImage });

          res.json({ token, user: userCreated });
     }

}




export default signController;