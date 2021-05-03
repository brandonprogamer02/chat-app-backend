import { io } from "..";
import ChatModel from "../../models/ChatModel";
import UserModel from "../../models/UserModel";
import { IChat, IUser } from "../../types";
import { INewMessageSocketEmit, INewConnectionSocketEmit } from "../../types/socket";
import SocketAdmin from "../SocketAdmin";

export default async function newMessageListener(arg: INewMessageSocketEmit) {
     const allSocketsConnected = SocketAdmin.getAllSockets();
     const userIdOfSender = SocketAdmin.getUserIdBySocketId(arg.chatId);
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
                    io.to(eachElement.socketId).emit('NEW_MESSAGE', { chat, userId: userIdOfSender });
                    return true;
               }
          });

     });
}