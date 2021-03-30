import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoConnection from './mongoDbConnection';
import prueba from './pruebas';
import routes from './routes/index';
import socketIO from './socket';

// initial variable entorno
dotenv.config();

// get express
export const app = express();

// // turning cors
app.use(cors());

// defining port
app.set('PORT', process.env.port || 5000);

//connection to database
mongoConnection();
prueba();

// turning json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// turning route
routes();

// turning on server
export const server = app.listen(app.get('PORT'), () => {
    console.log('Server is Running in port ' + app.get('PORT'))
});


//turning socket.io
// socketIO();