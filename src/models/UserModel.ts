import { model, SchemaTypes, Schema,Document } from 'mongoose'
import { IUser } from '../types';

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

 

const UserModel = model<Document<IUser>>('Users', UserSchema);


export default UserModel;