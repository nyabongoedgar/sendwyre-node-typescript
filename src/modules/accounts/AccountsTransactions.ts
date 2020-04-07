import assert from "assert";
import { connection } from "../../database/Database";
import { createAccount, createPaymentMethod, attachBlockChainToPaymentMethod, getAllPaymentMethods } from "./WyreService";



export default class AccountsTransactions {
    static dbConn = connection();

    static async postAccountTransaction(req: any, res: any) {
        try {
            const response = await createAccount();
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db("myproject");
            db.collection('accounts').insertOne({
                userId: Math.random(),
                account: response
            }, function (err: any, result: any) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                }
                if (result) {
                    // console.log('Success: ' + JSON.stringify(result));
                    console.log('Success: ' + JSON.stringify(response));
                    res.send({
                        message: 'Account created successfully',
                        success: 'true',
                        response: response
                    });
                }

            });
        }
        catch (err) {
            res.status(500).json({
                error: 'connection to the database server faile'
            });
        }
    }

    static async getAccountTransaction(req: any, res: any, userId: any) {
        try {
            let dbConn2 = await this.dbConn;
            const db = dbConn2.db("myproject");
            db.collection('accounts').findOne({
                userId: userId
            }, function (err: any, result: any) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                }

                if (result === null) {
                    res.status(200).json({
                        message: 'Account not found',
                        success: 'false'
                    });
                } else {
                    res.status(200).send({
                        message: 'Account retrieved successfully',
                        success: 'true',
                        response: result
                    });
                }

            });
        } catch (err) {
            res.send({ error: 'Connection failed' })
        }
    }

    static async createPaymentMethod(req: any, res: any) {
        const response = await createPaymentMethod(req.body.accountId, req.body.publicToken);
        // if (!(Object.keys(response).length === 0 && response.constructor === Object)) {
        //     res.status(200).send({
        //         message: 'payment method created not created',
        //         success: 'false'
        //     });
        // }
        try {
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db("myproject");
            db.collection('paymentMethods').insertOne({
                userId: '',
                paymentMethod: response
            }, function (err: any, result: any) {
                if (err) {
                    res.status(400).send({
                        message: 'failed to create payment method'
                    })
                }
                res.status(200).send({
                    message: 'payment method created',
                    paymentMethod: response
                });
            });
        } catch (err) {
            res.send({
                error: 'Connection failed'
            })
        }
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any) {
        try {
            const response = await attachBlockChainToPaymentMethod(req.body.paymentMethodId, req.body.accountId);
            res.status(201).json({
                messsage: `BTC AND ETH addresses added to payment method ${req.body.paymentMethodId}`,
                success: true,
                response: response
            })
            // let dbConn2 = await this.dbConn;
            // let db = dbConn2.db("myproject");
            //we then update our payment method db

        } catch (err) {
            res.send('Connection to database failed');
        }


    }


    // static async createPaymentMethod(req: any, res: any){
    //     try{
    //         const response = await createPaymentMethod(req.body.accountId, req.body.publicToken);
    //         let dbConn2 = await this.dbConn;
    //         let db = dbConn2.db("myproject");

    //     }

    // }
}
