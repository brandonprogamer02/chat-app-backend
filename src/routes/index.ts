import express from 'express';
import userRoutes from './UserRoutes';
import chatRoutes from './ChatRoutes';
import LoginRoutes from './AuthRoutes';
import { app } from '../index';


export function routes() {

    // loading all routes
    app.get('/', (res, req) => {
        req.send('Estas Home')
        
    });
    // home
    app.use(
        userRoutes(),
        chatRoutes(),
        LoginRoutes()
    );

}

export default routes