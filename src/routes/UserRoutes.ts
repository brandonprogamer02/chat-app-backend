import express from 'express'
import { deleteUser, getUser, getUsers, insertUser, updateUser } from '../controllers/UserController'

const router = express.Router()

const routes = () => {

     router
          .get('/user', getUsers)

          .get('/user/:id', getUser)
          
          .post('/user/', insertUser)

          .put('/user/:id', updateUser)

          .delete('/user/:id', deleteUser)

          

     return router
}

export default routes