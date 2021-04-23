import { io } from "..";
import { IChat, IUser } from "../../types";
import { IDeleteChatSocketEmit } from "../../types/socket";
import SocketAdmin from "../SocketAdmin";

export default async function deleteChatListener({ chat, socketId }: IDeleteChatSocketEmit) {
     const userIdSender = SocketAdmin.getUserIdBySocketId(socketId);
     (chat.members as IUser[]).forEach(member => {
          const userId: string = member._id as string;
          const socketsIdOfThisUser = SocketAdmin.getSocketIdByUserId(userId);
          // sending the notification/event to all members of the chat except the sender
          socketsIdOfThisUser.forEach(socketIdOfThisUser => {
               // validation to do not send to ourselves
               if (socketIdOfThisUser !== socketId) {
                    io.to(socketIdOfThisUser).emit('DELETE_CHAT', { chat, userId: userIdSender });
               }
          })
     })
}
