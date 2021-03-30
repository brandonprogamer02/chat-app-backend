import { model, SchemaTypes, Schema, Document } from 'mongoose'
import { IUser } from './UserModel';

export interface IMessage {
     author: string | IUser,
     text: string,
     date: Date,
}

export interface IChat {
     members: string[],
     createdAt: Date,
     author: string,
     messages: IMessage[]
} 

const ChatSchema = new Schema({
     members: [{
          ref: 'Users',
          type: SchemaTypes.ObjectId
     }],
     createdAt: {
          trim: true,
          type: SchemaTypes.Date
     },
     author: {
          trim: true,
          ref: 'Users',
          type: SchemaTypes.ObjectId
     },
     messages: [{
          author: {
               trim: true,
               ref: 'Users',
               type: SchemaTypes.ObjectId
          },
          text: {
               trim: true,
               type: SchemaTypes.String
          },
          date: {
               trim: true,
               type: SchemaTypes.Date
          },
     }]

}, { versionKey: false })


const ChatModel = model('Chats', ChatSchema);
export default ChatModel