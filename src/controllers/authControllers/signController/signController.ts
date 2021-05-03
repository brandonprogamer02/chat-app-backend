import { RequestHandler } from "express";
import { ICreateUserAndTokenJWT, IUser, IUserSign } from "../../../types";
import { verifyIfExistFaceAndIfIsBelongToOtherUser } from '../../../facialRecognition/utils'
import { createUserAndTokenJWT } from "../../../auth";

const signController: RequestHandler = async (req, res, next): Promise<void> => {

     const { username, password, userLogImage }: IUserSign = req.body;
     // validations
     if (!username) res.status(400).send('The property "username" has not been provided');
     else if (!password) res.status(400).send('The property "password" has not been provided');
     else {

          const { dataRecognition, facesDetecting } = await verifyIfExistFaceAndIfIsBelongToOtherUser(userLogImage);
          // if do not match continue
          console.log(facesDetecting)
          if (facesDetecting == 0) {
               res.json({
                    token: null,
                    faceDetecting: facesDetecting == 0 ? false : true,
                    faceRecognition: false
               })
          }else if (!dataRecognition) {
               // create the user and tok    en
               const resJWT: ICreateUserAndTokenJWT = await createUserAndTokenJWT({ username, password, userLogImage });
               // const userId = resJWT.userCreated._id as string;
               // response to client
               res.json({
                    token: resJWT.token,
                    faceDetecting: facesDetecting == 0 ? false : true,
                    faceRecognition: false
               });
          } else if (dataRecognition) {
               res.json({
                    token: null,
                    faceDetecting: facesDetecting == 0 ? false : true,
                    faceRecognition: true
               })
          }
     }

}




export default signController;