import { io } from "..";
import { IUser } from "../../types";
import { IDeleteMessageEmit } from "../../types/socket";
import SocketAdmin from "../SocketAdmin";


function deleteMessageListener({ socketId, chat }: IDeleteMessageEmit) {
     const userIdSender = SocketAdmin.getUserIdBySocketId(socketId);
     (chat.members as IUser[]).forEach(member => {
          const userId: string = member._id as string;
          const socketsIdOfThisUser = SocketAdmin.getSocketIdByUserId(userId);
          // sending the notification/event to all members of the chat except the sender
          socketsIdOfThisUser.forEach(socketIdOfThisUser => {
               // validation to do not send to ourselves
               if (socketIdOfThisUser !== socketId) {
                    io.to(socketIdOfThisUser).emit('DELETE_MESSAGE', { chat, userId: userIdSender });
               }
          })
     })

}

export default deleteMessageListener;