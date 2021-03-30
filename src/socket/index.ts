import { server } from '../index'
import { Socket } from 'socket.io'


interface NewUserConnectedRes {
     userId: string,
     socketId: string
}

const peopleConnected: NewUserConnectedRes[] = []

export default () => {

     const io = require("socket.io")(server, {
          cors: {
               origin: "http://localhost:3000",
               methods: ["GET", "POST"]
          }
     });


     io.on('connection', (socket: Socket) => {

          socket.on('reload-chat', (res: any) => {
               const { membersId } = res
               // console.log('se ha recibido el reload-chat', membersId)
          })

          socket.on('new-user-connected', (res: NewUserConnectedRes) => {
               // const { membersId } = res
               // console.log('se ha recibido el evento new-user-connected', res) 
               peopleConnected.push(res)
          })



     })



}