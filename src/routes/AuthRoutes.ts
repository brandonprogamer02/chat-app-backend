import express from 'express';

import { logController, signController } from '../controllers/AuthController';

const router = express.Router();

const routes = () => {

     // registro endopoint
     router.post('/sign', signController);

     // inicio sesion endpoint
     router.post('/log', logController);

     return router;
}

export default routes