
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://root:root@cluster0-sttce.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });

export const connection =  async () => {
    try {
        const conn = await client.connect();
        return conn;
    } catch (err) {
        console.log(err)
    }
}
