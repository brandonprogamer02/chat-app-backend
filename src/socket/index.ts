import { server } from '../index';
import { Socket, } from 'socket.io';
import { deleteChatListener, newConnectionListener, newMessageListener } from './listeners';

export let io: Socket;

export default () => {

     io = require("socket.io")(server, {
          cors: {
               origin: "http://192.168.100.36:3000",
               methods: ["GET", "POST"]
          }
     });

     io.on('connection', (socket: Socket) => {

          socket.on('NEW_MESSAGE', newMessageListener);

          socket.on('NEW_CONNECTION', newConnectionListener);

          socket.on('DELETE_CHAT', deleteChatListener);

     });

}

