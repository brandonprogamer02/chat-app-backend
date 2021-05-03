import userRoutes from './UserRoutes';
import chatRoutes from './ChatRoutes';
import LoginRoutes from './AuthRoutes';
import { app } from '../index';

export function routes() {

    // loading all routes
    app.use(
        userRoutes(),
        chatRoutes(),
        LoginRoutes()
    );

}

export default routes