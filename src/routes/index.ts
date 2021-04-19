import userRoutes from './UserRoutes';
import chatRoutes from './ChatRoutes';
import LoginRoutes from './AuthRoutes';
import { app } from '../index';
import path from 'path';
import facialRecognition from '../facialRecognition'

export function routes() {

    app.post('/upload', async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // this is the image received
        try {
            let { userFace } = req.files as any;
            console.log(userFace);
            
            const res1 = await facialRecognition(userFace.tempFilePath);
            res.json(res1);
        } catch (error) {
            res.send(400).send('que bobo yae');
            console.log(error);
        }
    });

    // loading all routes
    app.use(
        userRoutes(),
        chatRoutes(),
        LoginRoutes()
    );

}

export default routes