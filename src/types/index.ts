import { Document } from 'mongoose'
export interface BodyParam {
     field: string,
     value: any
}

export interface IUser {
     username: string; password: string; active: boolean; contacts: string[]; imageProfile: string;
}

export interface IChat {
     members: string[],
     createdAt: Date,
     author: string,
     messages: IMessage[]
}

export interface IMessage {
     author: string | IUser,
     text: string,
     date: Date,
}

export interface IUserSign {
     username: string,
     password: string
}

export interface IUserLogn {
     username: string,
     password: string
}

export interface IVerifyJWT {
     authData: null | any
}

export interface ICreateTokenJWT {
     token: string | null
}

export interface ICreateUserAndTokenJWT {
     token: string, userCreated: Document<IUser>
}