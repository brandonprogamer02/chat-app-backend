import { RequestHandler } from 'express';
import ChatModel, { IChat } from '../models/ChatModel';

export const getChats: RequestHandler = async (req, res, next) => {
     const member1 = req.query.member1;
     // is we receive members filter by member else not filter
     const filter = member1 ? { members: { $all: [member1] } } : {};
     try {
          const chat = await ChatModel.find(filter).populate('members author messages.author');
          res.json(chat);
     } catch (error) {
          console.log(error.message);
          res.status(400).send(error.message);
          next();
     }
}

export const getChat: RequestHandler = async (req, res, next) => {
     const id = req.params.id;
     // is we receive members filter by member else filter by id
     const filter = { _id: id }
     try {
          const chat = await ChatModel.findOne(filter).populate('members author messages.author');
          if (chat) {
               res.json(chat);
          } else {
               res.status(400).send('Do not match a chat with the chat-id provided');
          }
     } catch (error) {
          console.log(error.message);
          res.status(400).send(error.message);
          next();
     }
}

export const insertChat: RequestHandler = async (req, res, next) => {
     const { members, author, createdAt, messages }: IChat = req.body;

     if (!members) res.status(400).send('the property "member" has not been provided');
     else if (!author) res.status(400).send('the property "author" has not been provided');
     else if (!createdAt) res.status(400).send('the property "createdAt" has not been provided');
     else if (!messages) res.status(400).send('the property "messages" has not been provided');

     else {
          try {
               const newChat = await new ChatModel({ members, author, createdAt, messages }).save();
               res.send(newChat);
          } catch (error) {
               console.log(error.messages);
               res.status(400).send(error.message);
               next();
          }

     }
}

export const updateChat: RequestHandler = async (req, res, next) => {

     const id = req.params.id;
     const { value, field } = req.body;
     let p = {};
     // validations
     if (field) {
          // verify if the field provides match with any field of Document User
          if (field === 'members' || field === 'createdAt' || field === 'author' || field === 'messages' ) { }
          else {
               res.status(400).send(`the field "${field}" provided no match with any field of de document User`);
               return;
          }
     }else{
          res.status(400).send('The property "field" has not been provided');
          return;
     }
     if(!value){
          res.status(400).send('The property "value" has not been provided');
          return;
     }

     try {
          switch (req.body.field) {
               case "members":
                    p = { $push: { members: value } }
                    break;
               case "createdAt":
                    p = { $set: { createdAt: value } }
                    break;
               case "author":
                    p = { $set: { author: value } }
                    break;
               case "messages":
                    const document: any = await ChatModel.findById(id)
                    const messages = document.messages
                    p = { $set: { messages: [...messages, value] } }
                    break;
               default:
                    p = value
                    break;
          }

          const resChat = await ChatModel.findByIdAndUpdate(id, p);

          if(resChat) res.send('User updated Successfully')

          else res.status(400).send('Do not match a chat with the chat-id provided')
          
          
     } catch (error) {
          console.log(error.message);
          res.status(400).send(error.message);
          next();
     }
}

export const deleteChat: RequestHandler = async (req, res, next) => {
     const id = req.params.id;
     try {
          const resChat = await ChatModel.findByIdAndRemove(id);
          if(resChat){
               res.send('Chat deleted Successfully');
          } else res.status(400).send('Do not match a chat with a chat-id provided');
     } catch (error) {
          console.log(error);
          res.status(400).send(error.message);
          next();
     }
}

