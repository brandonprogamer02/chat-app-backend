import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/UserModel'

export interface IUserAuth {
     username: string,
     password: string
}


export const createUserAndTokenJWT = async (user: IUserAuth) => {

     // se crea un nuevo token con los datos del usuario ligados a el
     const userCreated = {
          username: user.username,
          password: user.password,
          active: false,
          contacts: [],
          imageProfile: ''
     }
     const token = jwt.sign({ user: userCreated }, 'SECRETKEY');
     const data = await new UserModel(userCreated).save();
     return { token, userCreated: data }

}
export const createTokenJWT = async (user: any) => {

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


export const verifyJWT = (token: string | undefined) => {
     let res: { authData: any } = { authData: null }
     if (token !== undefined) {
          try {
               // verificamos si el token que hemos recibido es valido
               const authData = jwt.verify(token, 'SECRETKEY')
               res = { authData }
          } catch (error) {
               res = { authData: null }
          }
     }
     return res
}