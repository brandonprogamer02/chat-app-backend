import mongoose, { Error, ConnectionOptions } from 'mongoose';

function mongoConnection() {
     const mongoDBAtlas = process.env.STRING_CONNECTION_ONLINE
     const mongoDBLocal = process.env.STRING_CONNECTION_LOCAL

     if (mongoDBLocal === undefined) throw new Error('')
     if (mongoDBAtlas === undefined) throw new Error('')

     const connectionParams: ConnectionOptions = {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
     }

     mongoose.connect(mongoDBLocal, connectionParams)
          .then(() => {
               console.log('Connected to database ' )
          })
          .catch((err: Error) => {
               console.error(`Error connecting to the database. \n${err.message}`);
          })
}

export default mongoConnection