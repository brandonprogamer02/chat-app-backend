import { Schema, model, SchemaTypes, Document } from 'mongoose'
import ChatModel from './models/ChatModel';
import UserModel from './models/UserModel';

export default async function prueba() {


     interface IGame extends Document {
          title: String,
          date: Date,
          publishers: string[]
     }

     const Publisher = model('Publisher', new Schema({
          companyName: String,
          firstParty: Boolean,
          website: String
     }, { versionKey: false }));


     const Game = model<IGame>('Game', new Schema({
          title: String,
          date: Date,
          publishers: [{
               type: SchemaTypes.ObjectId,
               ref: 'Publisher'
          }]
     }, { versionKey: false }));

     async function createPublisher(companyName: string, firstParty: boolean, website: string) {
          const publisher = new Publisher({
               companyName,
               firstParty,
               website
          });

          await publisher.save();
     }

     async function createGame(title: string, date: Date, publishers: string[]) {
          const data = { title, publishers, date }
          const game = new Game(data)
          await game.save()
     }

     async function listGames() {
          const games = await Game.find({}).populate('publishers', 'companyName -_id')

          console.log(games[0])
     }
     async function listPublishers() {
          const publisher = await Publisher.find({});
          console.log(publisher)
     }

     // createPublisher('Square Enix', true, 'https://www.SquareEnix.com/');
     // createGame('TLOZ: Breath Of The Wild', new Date(), ['6029a49919133f165c037a35', '6029a5060a266025d4458de0'])
     // listGames()
     // listPublishers()
     
     
}

