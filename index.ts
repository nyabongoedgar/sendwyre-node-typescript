import app from './src/app';
import AccountsController from './src/modules/accounts/AccountsController';
import AccountsTransactions from './src/modules/accounts/AccountsTransactions';
import {getAndupdatePaymentMethod} from './src/modules/accounts/WyreService';
import {connection} from './src/database/Database';

export const port = 3000;

app.listen(port, () => console.log(`SendWyre app listening on port ${port}!`))

//my testig route
app.get('/a', async (req, res, next) => {
    try{
        // const response = await getAndupdatePaymentMethod('fssdsds', 'PA_4AHVPPBJ8BR');
        // const response  = await AccountsController.updatePaymentMethod(req, res, next)
        // await AccountsTransactions.UpdatePaymentMethod(req, res, next);
        const dbConn = await connection();
        let db = await dbConn.db('UnifyreSendWyre');
        const result = await db.collection('User').find({
            "transactions.id": "TF_AAE4MU7RPJ4"
        }).toArray();
        console.log(result, 'this is the result');
        console.log(result[0].wyreAccount.id, 'wyre account id')
        db.collection('User').update({
            "transactions.id": "TF_AAE4MU7RPJ4"
        }, {"$set" : {"transactions.$": {name: 'Odiambo'}}, "$inc": { "version": 1 }}, {"upsert": false}, function(err: any, result: any){
            if(err) console.log(err, 'error from kaloli');
            console.log(result, 'this is the result from kalolo');
        })
        res.send(result)
        
  
        
    }catch(err){next(err);}
})