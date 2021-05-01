import { RequestHandler } from "express";
import { verifyJWT } from "../../../auth";
import { IUserLog, IVerifyJWT } from "../../../types";
import loginByUserCredentials from './loginByUserCredentials';
import loginByFacialRecognition from './loginByFacialRecognition';

const logController: RequestHandler = async (req, res, next): Promise<void> => {
     try {
          const { user, token, base64image }: IUserLog = req.body;
          // validations
          if (user || token || base64image) {
               if (user) {
                    await loginByUserCredentials(user, res);
                    // is valid token?
               } else if (token) {
                    const { authData }: IVerifyJWT = verifyJWT(req.body.token);
                    if (authData) res.json({ tokenValid: true });
                    else res.json({ tokenValid: false });

                    // login by facial recognition
               } else if (base64image) {
                    loginByFacialRecognition(base64image, res);
               }
          } else {
               res.status(400).send('The property "user" or "token" or "resource" has not been provided. You must pass some of two');
          }

     } catch (error) {
          console.log(error);
     }

}

export default logController;