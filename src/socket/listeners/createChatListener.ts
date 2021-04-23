import { IUser } from "../../types";
import { ICreateChatEmit } from "../../types/socket";
import SocketAdmin from "../SocketAdmin";
import { io } from "..";
import UserModel from "../../models/UserModel";

function createChatListener({ chat, socketId }: ICreateChatEmit) {
     console.log('se recibio un envento crear chat: ');
     const userId = SocketAdmin.getUserIdBySocketId(socketId);
     console.log(chat);
     // sending the notification of tha all clients that will be of this chat
     (chat.members as string[]).forEach(async (memberId) => {
          const socketIds = SocketAdmin.getSocketIdByUserId(memberId as string);
          const user = await UserModel.findById(memberId as string) as unknown as IUser;

          socketIds.forEach(socketId => {
               if (userId !== user._id as string) {
                    console.log('Se envio una notificacion de nuevo chat a ' + user.username + 'con socketId: ' + socketId);
                    io.to(socketId).emit('CREATE_CHAT', { chat, userId });
               }
          })
     });

}

export default createChatListener;