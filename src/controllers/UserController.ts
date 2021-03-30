import { RequestHandler } from 'express'
import { verifyJWT } from '../auth';
import UserModel, { IUser } from '../models/UserModel'
import { Error } from 'mongoose';

export const getUsers: RequestHandler = async (req, res, next) => {
     const username = req.query.username;
     const token = req.query.token;

     if (username) {
          // find the all documents(users) that contain the username
          const user = await UserModel.find({ username: { $regex: username } }, '-password').populate('');
          if (user.length > 0) {
               res.json(user);
          } else {
               res.status(400).send('the user not found in database by username');
          }

     } else if (token) {
          const resJWT = verifyJWT(token as string);
          try {
               if (resJWT.authData) {
                    console.log(resJWT.authData);
                    const username = resJWT.authData.user.username;
                    const usernameData = await UserModel.findOne({ username: username }, '-password');
                    res.json({ user: usernameData });
               } else {
                    res.status(400).send('token is invalid');
               }
          } catch (error) {
               res.status(400).send('token is invalid');
          }
     } else {
          const users = await UserModel.find({}, '-password').populate('');
          res.json(users);
     }

}

export const getUser: RequestHandler = async (req, res, next) => {
     const id = req.params.id;

     try {
          const user = await UserModel.findById(id, '-password').populate('contacts');
          res.json(user);
     } catch (error) {
          console.log(error);
          res.status(400).send('the user not found in database by id');
          next();
     }

}

export const insertUser: RequestHandler = async (req, res, next) => {
     const user = req.body;
     // validation for received user

     if (!user.username) res.status(400).send('the property "username" has not been provided');
     else if (!user.password) res.status(400).send('the property "password" has not been provided');
     else {
          const userToDB: IUser = {
               active: false,
               contacts: [],
               imageProfile: '',
               password: user.password,
               username: user.username
          }

          try {
               const dataUser = await new UserModel(userToDB).save();
               res.json(dataUser);

          } catch (error) {
               console.log(error);
               res.sendStatus(400).send('the user cannot insert in database');
               next();
          }
     }

}

export const updateUser: RequestHandler = async (req, res, next) => {
     const id = req.params.id;
     const { field, value } = req.body;
     // verify if field exists and if field is correct
     if (field) {
          // verify if the field provides match with any field of Document User
          if (field === 'contacts' || field === 'username' || field === 'password' || field === 'active' || field === 'imageProfile') { }
          else {
               res.status(400).send(`the field "${field}" provided no match with any field of de document User`);
               return;
          }
     } else {
          res.status(400).send('property "field" has not been provided');
          return;
     }
     // verify if property value exists
     if (!value) {
          res.status(400).send('property "value" has not been provided');
          return;
     }

     try {
          console.log('entro');
          let updateObject = {}
          switch (req.body.field) {
               case "username":
                    updateObject = { $set: { username: req.body.value } };
                    break;
               case "password":
                    updateObject = { $set: { password: req.body.value } };
                    break;
               case "contacts":
                    const document: any = await UserModel.findById(id);
                    updateObject = { $set: { contacts: [...document.contacts, req.body.value] } };
                    break;
               case "imageProfile":
                    updateObject = { $set: { imageProfile: req.body.value } };
                    break;
               case "active":
                    updateObject = { $set: { active: req.body.value } };
                    break;
               case "all":
                    updateObject = req.body.value;
                    break;
          }
          const userUpdated = await UserModel.findByIdAndUpdate(id, updateObject, { new: true });
          res.json(userUpdated);
     } catch (error) {
          console.log(error);
          res.status(400).send(error.message);
          next();
     }
}

export const deleteUser: RequestHandler = async (req, res, next) => {
     const id = req.params.id;

     try {

          const res1 = await UserModel.findByIdAndRemove(id);
          if (res1) res.send('User deleted Successfully');
          else res.send("Do not exists a user with the id provided");

     } catch (err) {
          const error: Error = err;
          console.log(error.message);
          res.status(400).send('the id provided is not valid');
          next();
     }

}