import express from 'express';

import logController from '../controllers/authControllers/logController';
import signController from '../controllers/authControllers/signController/signController';

const router = express.Router();

const routes = () => {

     // registro endopoint
     router.post('/sign', signController);

     // inicio sesion endpoint
     router.post('/log', logController);

     return router;
}

export default routes