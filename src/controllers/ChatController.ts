import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import ChatModel from '../models/ChatModel';
import { IChat, IChatArray, IChatBodyParam, IMessage } from '../types';

export const getChats: RequestHandler = async (req, res, next) => {
     const member1: string = req.query.member1 as string;
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
     const id: string = req.params.id;
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
     const { value, field }: IChatBodyParam = req.body;
     let p = {};
     // validations
     if (field) {
          // verify if the field provides match with any field of Document User
          if (field === 'members' || field === 'createdAt' || field === 'author' || field === 'messages') { }
          else {
               res.status(400).send(`the field "${field}" provided no match with any field of de document User`);
               return;
          }
     } else {
          res.status(400).send('The property "field" has not been provided');
          return;
     }
     if (!value) {
          res.status(400).send('The property "value" has not been provided');
          return;
     }

     try {
          switch (req.body.field) {
               case "members":
                    const AA = value as IChatArray;
                    if (isValidObjectId(AA.value)) {

                         if (AA.type === 'PUSH') {
                              p = { $push: { members: AA.value } };

                         } else if (AA.type === 'DELETE') {
                              const document: any = await ChatModel.findById(id);
                              const new1: IChat = document;
                              const obj = new1.members.filter(el => el != AA.value);
                              p = { $set: { members: obj } };
                         } else {
                              res.status(400).send('PUSH OR DELETE DO NOT HAVE PASSED FOR MEMBERS FIELD');
                              return;
                         }
                    } else {
                         res.status(400).send('the memberId sended is not valid objectId');
                    }
                    break;
               case "createdAt":
                    p = { $set: { createdAt: value } };
                    break;
               case "author":
                    p = { $set: { author: value } };
                    break;
               case "messages":
                    const AAA = value as IChatArray;
                    const fff = AAA.value as IMessage;
                    if (AAA.type === 'PUSH') {
                         if (fff.author && fff.date && fff.text) {
                              p = { $push: { messages: AAA.value } };
                         } else {
                              res.status(400).send('the messaje object sended is not valid');
                         }
                    } else if (AAA.type === 'DELETE') {
                         if (isValidObjectId(AAA.value)) {
                              const document: any = await ChatModel.findById(id);
                              const new1: IChat = document;
                              const obj = new1.messages.filter(el => el._id != AAA.value);
                              p = { $set: { messages: obj } };

                         } else {

                              res.status(400).send('the messageID is no valid objectID');
                         }
                    } else {
                         res.status(400).send('PUSH OR DELETE DO NOT HAVE PASSED FOR MESSAGES FIELD');
                         return;
                    }

                    break;
               default:
                    p = value;
                    break;
          }

          const resChat = await ChatModel.findByIdAndUpdate(id, p, { new: true }).populate('members author messages.author');;

          if (resChat) res.send(resChat);
          else res.status(400).send('Do not match a chat with the chat-id provided');

     } catch (error) {
          console.log(error.message);
          res.status(400).send(error.message);
          next();
     }
}

export const deleteChat: RequestHandler = async (req, res, next) => {
     const id: string = req.params.id;
     try {
          const resChat = await ChatModel.findByIdAndRemove(id);
          if (resChat) {
               res.json(resChat);
          } else res.status(400).send('Do not match a chat with a chat-id provided');
     } catch (error) {
          console.log(error);
          res.status(400).send(error.message);
          next();
     }
}

