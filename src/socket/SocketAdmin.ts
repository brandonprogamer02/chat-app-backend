import { INewConnectionSocketEmit } from "../types/socket";

class SocketAdmin {

     private static realArray: Array<INewConnectionSocketEmit> = [];

     public static isExistsSocketId(socketId: string) {
          return SocketAdmin.realArray.some((el) => el.socketId === socketId ? true : false);
     }

     public static addNewSocketObject(arg0: INewConnectionSocketEmit) {
          SocketAdmin.realArray.push(arg0);
     }

     public static getAllSockets() {
          return SocketAdmin.realArray;
     }
     public static getUserIdBySocketId(socketId: string) {
          let userId = '';
          SocketAdmin.realArray.every((el: INewConnectionSocketEmit) => {
               if(el.socketId == socketId){
                    userId = el.userId;
                    return true;
               }
          });
          return userId;
     }
}

export default SocketAdmin;