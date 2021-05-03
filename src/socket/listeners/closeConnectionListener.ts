


import SocketAdmin from "../SocketAdmin";


function closeConnectionListener(socketId: string) {
     console.log('Se cerro la conexion para ' + socketId);
     SocketAdmin.deleteSocket(socketId);
}

export default closeConnectionListener;