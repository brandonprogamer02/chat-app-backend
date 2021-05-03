import { INewConnectionSocketEmit } from "../../types/socket";
import SocketAdmin from "../SocketAdmin";

export default  function newConnectionListener(arg: INewConnectionSocketEmit) {
     console.log(`NEW CLIENT CONNECTED: ${arg.socketId}`);
     if (arg.socketId) {
          SocketAdmin.addNewSocketObject(arg);
     }
}