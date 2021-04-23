import mongoose, { Error, ConnectionOptions } from 'mongoose';

async function mongoConnection() {
     const mongoDBAtlas = process.env.STRING_CONNECTION_ONLINE
     const mongoDBLocal = process.env.STRING_CONNECTION_LOCAL

     if (mongoDBLocal === undefined) throw new Error('')
     if (mongoDBAtlas === undefined) throw new Error('')

     const connectionParams: ConnectionOptions = {
          // useNewUrlParser: true,
          // useCreateIndex: true,
          useUnifiedTopology: true
     };
     try {
          await mongoose.connect(mongoDBAtlas);
          console.log('Connected to database ');
     } catch (error) {
          console.error(`Error connecting to the database. \n${error.message}`);
     }
}

export default mongoConnection