import { server } from '../index';
import { Socket, } from 'socket.io';
import deleteChatListener from './listeners/deleteChatListener';
import newConnectionListener from './listeners/newConnectionListener';
import newMessageListener from './listeners/newMessageListener';
import createChatListener from './listeners/createChatListener';
import closeConnectionListener from './listeners/closeConnectionListener';
import deleteMessageListener from './listeners/deleteMessageListener';

export let io: Socket;

export default () => {

     const onlinePermiss= 'https://brandox-chat-app.netlify.app/';
     const offlinePermiss = 'http://localhost:3000/'

     io = require("socket.io")(server, {
          cors: {
               origin: onlinePermiss,
               methods: ["GET", "POST"]
          },

     });

     io.on('connection', (socket: Socket) => {

          socket.on('disconnect', function () {
               io.emit('user disconnected');
          });

          socket.on('NEW_MESSAGE', newMessageListener);

          socket.on('NEW_CONNECTION', newConnectionListener);

          socket.on('DELETE_CHAT', deleteChatListener);

          socket.on('CREATE_CHAT', createChatListener);

          socket.on('CLOSE_CONNECTION', closeConnectionListener);

          socket.on('DELETE_MESSAGE', deleteMessageListener);
         
     });

     

}

