import ChatModel from "../../models/ChatModel";
import UserModel from "../../models/UserModel";
import { IChat, IUser } from "../../types";
import { INewConnectionSocketEmit, INewMessageSocketEmit, IDeleteChatSocketEmit } from "../../types/socket";
import SocketAdmin from "../SocketAdmin";
import { io } from '../index';

export async function newMessageListener(arg: INewMessageSocketEmit) {
     const allSocketsConnected = SocketAdmin.getAllSockets();
     allSocketsConnected.forEach(async (eachElement: INewConnectionSocketEmit) => {

          const userId: string = eachElement.userId;
          // getting the chats that contain the user id
          const chats = await ChatModel.find({ members: { $all: userId } }).populate('members author messages.author') as unknown as IChat[];
          // this every iterator es for only 1 step, that is when found the equal chatId 
          chats.every(async (chat: IChat) => {
               if (chat._id == arg.chatId) {
                    // console.log('userId es' + userId);
                    const user: IUser = await UserModel.findById(userId) as unknown as IUser;
                    console.log('-----------------------');
                    console.log(`the socket ${eachElement.socketId}, user: ${user.username} receive NEW_MESSAGE`)
                    io.to(eachElement.socketId).emit('NEW_MESSAGE', chat);
                    return true;
               }
          });

     });
}

export function newConnectionListener(arg: INewConnectionSocketEmit) {
     console.log(`NEW CLIENT CONNECTED: ${arg.socketId}`);
     if (arg.socketId) {
          SocketAdmin.addNewSocketObject(arg);
     }
}

export async function deleteChatListener(arg: IDeleteChatSocketEmit) {
     const allSocketsConnected = SocketAdmin.getAllSockets();
     // getting the userId of the origin emiter
     // const userIdOriginalEmiter = SocketAdmin.getUserIdBySocketId(arg.socketId);
     // getting the sockets that are the chat that is to delete 
     const f = allSocketsConnected.filter(async (eachElement: INewConnectionSocketEmit) => {
          let userId: string = eachElement.userId;
          // getting the chats that contain the user id
          const chats = await ChatModel.find({ members: { $all: userId } }) as unknown as IChat[];
          // this every iterator es for only 1 step, that is when found the equal chatId 
          const retorno = chats.every(async (chat: IChat) => {
               if (chat._id == arg.chatId) {
                    const user: IUser = await UserModel.findById(userId) as unknown as IUser;
                    console.log('-----------------------');
                    console.log(`the socket ${eachElement.socketId}, user: ${user.username} receive DELETE_CHAT`);
                    return true;
               }
          });
          if(retorno) return true
          else return false
     });
     // delete the chat
     await ChatModel.findByIdAndDelete(arg.chatId);
     console.log(f);
     // send the notification to the alls sockets
     f.forEach(fe => {
          console.log('se mando a borrar a ' + fe.socketId);
          io.to(fe.socketId).emit('DELETE_CHAT', arg.chatId)
     });
}