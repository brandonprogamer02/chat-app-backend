import { model, SchemaTypes, Schema,Document } from 'mongoose'

const UserSchema = new Schema({
     username: SchemaTypes.String,
     password: SchemaTypes.String,
     active: SchemaTypes.Boolean,
     contacts: [{
          ref: 'Users',
          type: SchemaTypes.ObjectId
     }],
     imageProfile: SchemaTypes.String
}, { versionKey: false });

export interface IUser {
    username: string,
    password: string,
    active: boolean,
    contacts: string[],
    imageProfile: string 
} 

const UserModel = model<Document<IUser>>('Users', UserSchema);


export default UserModel;