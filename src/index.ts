import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoConnection from './mongoDbConnection';
import fs from 'fs';
import routes from './routes/index';
import socketIO from './socket';
import path from 'path';
import pruebas from './pruebas';

// initial variable entorno
dotenv.config();

// get express
export const app = express();

// // turning cors
app.use(cors());

// defining port
app.set('PORT', process.env.PORT || 5000);

//connection to database
mongoConnection();
pruebas();

// turning json
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// turning route
routes();

// turnin public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// turning on server
export const server = app.listen(app.get('PORT'), () => {
    console.log('Server is Running in port ' + app.get('PORT'))

    //turning socket.io
    const _path = path.join(__dirname, 'facialRecognition', 'userFaces');
    if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
        console.log('userFaces dir has been created');

    }
});

socketIO();

