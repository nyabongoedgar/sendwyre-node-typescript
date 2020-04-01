import assert from "assert";
import { client } from "../../database/Database";
import { createAccount, getAccount, createPaymentMethod, updateAccount, attachBlockChainToPaymentMethod, getPaymentMethod, getAllPaymentMethods } from "./AccountsUtils";



export default class AccountsTransactions {

    static async postAccountTransaction(req: any, res: any) {
        const response = await createAccount();
        client.connect((err: any) => {
            let db = client.db("myproject");
            db.collection('accounts').insertOne({
                userId: Math.random() ,
                account: response}, function (err: any, result: any) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({
                        message: 'Account created successfully',
                        success: 'true',
                        response: result.ops[0]
                    });
                }
            });
            client.close();
        });
    }

    static async getAccountTransaction(req: any, res: any, userId: any) {
        client.connect((err: any) => {
            let db = client.db("myproject");
            db.collection('accounts').findOne({
                userId: userId
            }, function (err: any, result: any) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('Success: ' + JSON.stringify(result));
                    res.send({
                        message: 'Account retrieved successfully',
                        success: 'true',
                        response: result
                    });
                }
            });
            client.close();
        });
    }
}
