
import { facialReconitionWithStorageImage } from ".";

//
export async function verifyIfExistFaceAndIfIsBelongToOtherUser(userLogImageBase64: string) {

     // const base64Data = userLogImageBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

     const res = await facialReconitionWithStorageImage(userLogImageBase64);

     return res;
}
