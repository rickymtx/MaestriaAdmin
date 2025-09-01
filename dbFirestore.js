const admin = require("firebase-admin");

var serviceAccount = JSON.parse(process.env.FIREBASE);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket("gs://maestria-b40dd.firebasestorage.app");

module.exports = {db, bucket};
