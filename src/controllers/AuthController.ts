import { RequestHandler } from "express";
import { IUserAuth, createUserAndTokenJWT, createTokenJWT, verifyJWT } from "../auth";


export const signController: RequestHandler = async (req, res, next) => {
     const { username, password }: IUserAuth = req.body;
     if (!username) res.status(400).send('The property "username" has not been provided')
     else if (!password) res.status(400).send('The property "password" has not been provided')
     else {
          const resJWT = await createUserAndTokenJWT({ username, password });
          res.json(resJWT.token);
     }

}

export const logController: RequestHandler = async (req, res, next) => {
     const { user, token } = req.body;
     if (user || token) {
          if (user) {
               if (!user.username) {
                    res.status(400).send('The property user."username" has not been provided');
                    return;
               }
               else if (!user.password) {
                    res.status(400).send('The property user."password" has not been provided');
                    return;
               } else {
                    const resJWT = await createTokenJWT(user);
                    if(resJWT.token){
                         res.json(resJWT);
                    }else{
                         res.status(400).send('The user provided do not exists in the database');
                         return;
                    }
               }
          } else if (token) {
               const { authData } = verifyJWT(req.body.token);
               if (authData) res.json({ tokenValid: true });
               else res.json({ tokenValid: false });
          }
     } else {
          res.status(400).send('The property "user" or "token" has not been provided. You must pass some of two');
     }


}