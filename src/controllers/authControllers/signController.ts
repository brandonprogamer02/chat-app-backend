import { RequestHandler } from "express";
import { createUserAndTokenJWT } from "../../auth";
import { IUserSign, ICreateUserAndTokenJWT } from "../../types";
import path from 'path';
import fs from 'fs';

const signController: RequestHandler = async (req, res, next): Promise<void> => {

     const { username, password, userLogImage }: IUserSign = req.body;
     if (!username) res.status(400).send('The property "username" has not been provided');
     else if (!password) res.status(400).send('The property "password" has not been provided');
     else {
          // create the user and token
          const resJWT: ICreateUserAndTokenJWT = await createUserAndTokenJWT({ username, password, userLogImage });
          const { userCreated: { _id } } = resJWT;
          // save the image in the disk storage
          saveUserLogImage(userLogImage, _id as string);
          // response to client
          res.json(resJWT.token);
     }

}

function saveUserLogImage(userLogImageBase64: string, userId: string) {

     // to declare some path to store your converted image
     const _path = path.join(__dirname, '..', '..', 'facialRecognition', 'userFaces', `${userId}.png`);

     // to convert base64 format into random filename
     const base64Data = userLogImageBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

     // save image
     fs.writeFileSync(_path, base64Data, { encoding: 'base64' });
}


export default signController;