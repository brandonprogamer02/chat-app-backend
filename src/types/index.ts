import { Document } from 'mongoose';

export interface BodyParam {
     field: string,
     value: any
}

export interface IUserArray {
     type: 'PUSH' | 'DELETE',
     value: string | IUser
}
export interface IChatArray {
     type: 'PUSH' | 'DELETE',
     value: string | IMessage
}

export interface IUserBodyParam extends BodyParam {
     value: string | boolean | IUserArray | IUser
}

export interface IChatBodyParam extends BodyParam {
     value: string | boolean | IChatArray | IChat | IMessage
}

export interface IUser {
     _id?: string, username: string; password: string; active: boolean; contacts: string[];
     imageProfile: string;
}

export interface IChat {
     _id?: string,
     members: string[],
     createdAt: Date,
     author: string,
     messages: IMessage[]
}

export interface IMessage {
     _id?: string,
     author: string | IUser,
     text: string,
     date: Date,
}

export interface IUserSign {
     username?: string,
     password?: string
}

export interface IUserLog {
     user: {
          username: string,
          password: string
     },
     token: string
}

export interface IVerifyJWT {
     authData: null | IUserSign | any
}

export interface ICreateTokenJWT {
     token: string | null
}

export interface ICreateUserAndTokenJWT {
     token: string, userCreated: Document<IUser>
}
