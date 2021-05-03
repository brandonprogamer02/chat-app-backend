import { ICreateTokenJWT, IUser, IUserMin, IUserSign } from "../../../types";
import { Response } from 'express'
import { createTokenJWT } from "../../../auth";

 

export default async function (user: IUserMin, res: Response) {

     if (user) {
          if (!user.username) {
               res.status(400).send('The property user."username" has not been provided');
               return;
          }
          else if (!user.password) {
               res.status(400).send('The property user."password" has not been provided');
               return;
          } else {

               // if the credentials(username and password) is correct return a token to client
               const resJWT: ICreateTokenJWT = await createTokenJWT(user);
               if (resJWT.token) {
                    res.json(resJWT);
               } else {
                    res.status(400).send('The user provided do not exists in the database');
                    return;
               }

          }
     }
}