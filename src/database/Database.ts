
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0-sttce.mongodb.net/test?retryWrites=true&w=majority";

export const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect((err: any) => {
//     let db = client.db("myproject");
//     let cursor = db.collection('accounts').find({userId: 292});
//     console.log(cursor.For);
//     // perform actions on the collection object
//     client.close();
// });
