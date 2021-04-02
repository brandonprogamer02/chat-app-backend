import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel'
import { ICreateTokenJWT, ICreateUserAndTokenJWT, IVerifyJWT,IUserSign } from '../types';

export const createUserAndTokenJWT = async (user: IUserSign): Promise<ICreateUserAndTokenJWT> => {

     // se crea un nuevo token con los datos del usuario ligados a el
     const userCreated = {
          username: user.username,
          password: user.password,
          active: false,
          contacts: [],
          imageProfile: ''
     };
     const token = jwt.sign({ user: userCreated }, 'SECRETKEY');
     const data = await new UserModel(userCreated).save();

     return { token, userCreated: data };

}

export const createTokenJWT = async (user: IUserSign): Promise<ICreateTokenJWT> => {

     const filter = { username: user.username, password: user.password };
     const userFinded = await UserModel.findOne(filter);
     // si se encuentra este usuario en la base de datos
     if (userFinded) {
          // se crea un nuevo token con los datos del usuario ligados a el
          const token = jwt.sign({ user }, 'SECRETKEY')
          return { token }
     }
     return { token: null };
}

export const verifyJWT = (token: string | undefined): IVerifyJWT => {
     let res: IVerifyJWT = { authData: null };
     if (token !== undefined) {
          try {
               // verificamos si el token que hemos recibido es valido
               const authData: {} = jwt.verify(token, 'SECRETKEY');
               res = { authData };
          } catch (error) {
               res = { authData: null };
          }
     }
     return res;
}