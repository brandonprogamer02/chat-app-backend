import path from "path";
import { facialReconitionWithStorageImage } from ".";
import fs from 'fs';

export async function verifyIfExistFaceAndIfIsBelongToOtherUser(userLogImageBase64: string) {

     // const _path = path.join(__dirname, '..', '..', 'facialRecognition', 'userFaces', `${userId}.png`);
     const _path = path.join(__dirname, 'tempUpload', `${Date.now()}.png`);
     const dir = path.join(__dirname, 'tempUpload');
     // create the dir where the image be will save
     if (!fs.existsSync(dir)) fs.mkdirSync(dir);

     // to convert base64 format into random filename
     const base64Data = userLogImageBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

     // save image
     fs.writeFileSync(_path, base64Data, { encoding: 'base64' });

     // the image is saved, now active the facial recognition system
     const res = await facialReconitionWithStorageImage(_path);
     // delete the image
     fs.unlinkSync(_path);
     // delete the dir
     fs.rmdirSync(dir);
     return res;
}


export function saveImageStorage(userLogImageBase64: string, userId: string) {
     const _path = path.join(__dirname, 'userFaces', `${userId}.png`);

     // to convert base64 format into random filename
     const base64Data = userLogImageBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

     // if the image of user do not match with other face then saved it

     fs.writeFileSync(_path, base64Data, { encoding: 'base64' });

}
