import express, { json } from 'express';
import { createUserAndTokenJWT, IUserAuth, createTokenJWT, verifyJWT } from '../auth';
import { logController, signController } from '../controllers/AuthController';
import ChatModel, { } from '../models/ChatModel';


const router = express.Router();

const routes = () => {
     // registro endopoint
     router.post('/sign', signController);

     // inicio sesion endpoint
     router.post('/log', logController);

     return router
}

export default routes