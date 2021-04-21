import userRoutes from './UserRoutes';
import chatRoutes from './ChatRoutes';
import LoginRoutes from './AuthRoutes';
import { app } from '../index';
import path from 'path';
import fs from 'fs';
import { facialReconitionWithStorageImage } from '../facialRecognition';

export function routes() {

    // app.post('/uploads', async (req, res, next) => {
    //     try {
            
    //         const { base64image, id } = req.body.resource;

    //         // to declare some path to store your converted image
    //         const _path = path.join(__dirname, '..', 'uploads', `${id}.png`);
    //         // const path = './images/' + Date.now() + '.png'

    //         // to convert base64 format into random filename
    //         const base64Data = base64image.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    //         // save image
    //         fs.writeFileSync(_path, base64Data, { encoding: 'base64' });
    //         // the image is saved, now active the facial recognition system
    //         const res1 = await facialReconitionWithStorageImage(_path);
    //         res.send(res1);
    //         // delete the image
    //         fs.unlinkSync(_path);

    //     } catch (e) {
    //         res.status(500).send(e);
    //         next(e);
    //     }
    // });

    // loading all routes
    app.use(
        userRoutes(),
        chatRoutes(),
        LoginRoutes()
    );

}

export default routes