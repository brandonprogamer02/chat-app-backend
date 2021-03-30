import express from 'express'
import { deleteChat, getChat, getChats, insertChat, updateChat } from '../controllers/ChatController'


const router = express.Router()

const routes = () => {

     router.get('/chat', getChats);

     router.get('/chat/:id', getChat);

     router.post('/chat', insertChat);

     router.put('/chat/:id', updateChat);

     router.delete('/chat/:id', deleteChat);

     return router
}

export default routes