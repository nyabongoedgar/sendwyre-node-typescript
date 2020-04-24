import assert from "assert";
import { connection } from "../../database/Database";
import { createAccount, createPaymentMethod, attachBlockChainToPaymentMethod, getPaymentMethod, createTransfer, getAccountFromWyre, SubscribeToAccountChanges, SubscribeToPaymentMethodChanges, SubscribeToTransferChanges ,getAccountForUpdate, getAndupdatePaymentMethod, getAndupdateTransfer } from "./WyreService";
import { runInNewContext } from "vm";
import { port } from '../../../index';



export default class AccountsTransactions {
    /*
    We need to update our queries with the id_ from unifyre
    */
    static dbConn = connection();
    static dbName = 'UnifyreSendWyre';
    static collectionName = 'User'

    static UserMongoSchema = { id: '', profile: {}, wyreAccount: {}, paymentMethods: [], transactions: [] }

    static async postAccountTransaction(req: any, res: any) {
        try {
            const response = await createAccount();
            let subscription = { "subscribeTo": `account:${response.id}`, "notifyTarget": `${req.hostname}:${port}/updateAccount` };
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);

            db.collection(this.collectionName).updateOne({ "_id": 40 }, { "$set": { "wyreAccount": response, "profile": {}, "paymentMethods": [], "transactions": [] }, "$inc": { "version": 1 } }, { "upsert": true }, async function (err: any, result: any) {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    });
                }
                if (result) {
                    console.log(result);
                    await SubscribeToAccountChanges(response.id, subscription);
                    res.status(201).json({
                        response,
                        count: result.upsertedCount,
                        message: 'Successfully modified document',
                        success: true
                    })
                }
            });
        }
        catch (err) {
            res.status(500).json({
                error: err,
                message: 'process failed'
            });
        }
    }
    /* Update statements start from here */
    static async UpdateAccountTransaction(req: any, res: any, next: any) {
        try {
            // "subscribed": "account:AC-F930QD8A2RRR",
            //best thing to do here is to query the db with the subscribed key to get the account Id instead of using slice
            /**
             * The returned payload has the following values
             * subscriptionId : The same ID returned when the subscription was created
             * trigger: The SRN of the object which triggered the callback (the same SRN assigned via subscribeTo) */
            const accountSRN = req.body.trigger;
            const accountId = accountSRN.split(':').pop();
            const response = await getAccountForUpdate(accountId);
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);
            db.collection(this.collectionName).updateOne({ "wyreAccount.id": accountId }, { "$set": { "wyreAccount": response }, "$inc": { "version": 1 } }, { "upsert": false }, async function (err: any, result: any) {
                if (err) {
                    console.log(err)
                    res.status(500).json()({
                        error: err
                    });
                }
                if (result) {
                    console.log(result);
                    res.status(201).json({
                        updatedAccount: response,
                        count: result.upsertedCount,
                        message: 'Successfully modified account',
                        success: true
                    });
                }
            });
        }
        catch (err) {
            res.status(400).json({
                error: err,
                message: 'process failed'
            });
        }
    }

    static async UpdatePaymentMethod(req: any, res: any, next: any) {
        try {
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);
            let paymentMethodSRN = req.body.trigger;
            let paymentMethodId = paymentMethodSRN.split(":").pop();
            const result = await db.collection(this.collectionName).find({
                "paymentMethods.id": paymentMethodId
            }).toArray();
            const wyreAccountId = result[0].wyreAccount.id;

            let updateCall = await getAndupdatePaymentMethod(wyreAccountId, paymentMethodId);

            db.collection(this.collectionName).update({
                "paymentMethods.id": paymentMethodId
            }, { "$set": { "paymentMethods.$": updateCall }, "$inc": { "version": 1 } }, { "upsert": false }, function (err: any, result: any) {
                if (err) console.log(err);
                console.log(result);
            });

        } catch (err) {
            // next(err)
            res.send(err)
        }
    }

    static async updateTransfer(req: any, res: any) {
        try {
            //this transferid comes from a webhook, so I get the transfer as in the following line
            //transfer:T_QRSSNSIUXUSD .. // This why we use slice, but regular expressions should be used.
            let transferSRN = req.body.trigger;
            let transferId = transferSRN.split(":").pop();
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);

            /**
             *  Method 2 */
            const result = await db.collection(this.collectionName).find({
                "transactions.id": transferId
            }).toArray();
            const wyreAccountId = result[0].wyreAccount.id;

            let updateCall = await getAndupdateTransfer(wyreAccountId, transferId);

            db.collection(this.collectionName).update({
                "transactions.id": transferId
            }, { "$set": { "transactions.$": updateCall }, "$inc": { "version": 1 } }, { "upsert": false }, function (err: any, result: any) {
                if (err) console.log(err);
                console.log(result);
            });
        } catch (error) {
            throw error;
        }
    }


    // updates stop here

    static async getUserInfoFromDb(req: any, res: any) {
        const userId = req.params.userId;
        console.log(Number(req.params), 'req.params');
        try {
            let dbConn2 = await this.dbConn;
            const db = dbConn2.db(this.dbName);
            db.collection(this.collectionName).findOne({
                _id: Number(userId)
            }, function (err: any, result: any) {
                if (err) {
                    res.send({ error: 'An error has occurred', success: false });
                }

                if (result === null) {
                    res.status(200).json({
                        message: 'User Account not found',
                        success: false
                    });
                } else {
                    res.status(200).send({
                        message: 'Account retrieved successfully',
                        success: true,
                        response: result
                    });
                }

            });
        } catch (err) {
            res.send({ error: 'Connection failed' })
        }
    }

    static async createPaymentMethod(req: any, res: any) {
        try {
            const response = await createPaymentMethod(req.body.accountId, req.body.publicToken);
            
            let subscription = {"subscribeTo":`${response.srn}`,"notifyTarget": `${req.hostname}:${port}/updatePaymentMethod`};
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);
            db.collection(this.collectionName).updateOne({
                _id: 40
            },
                { "$push": { paymentMethods: response }, "$inc": { "version": 1 } }, { "upsert": false }
                , async function (err: any, result: any) {
                    if (err) {
                        res.status(400).send({
                            message: 'failed to create payment method'
                        })
                    }
                    if (result) {
                        await SubscribeToPaymentMethodChanges(req.body.accountId, response.id, subscription);
                        res.status(200).send({
                            message: 'payment method created',
                            paymentMethod: response
                        });
                    }
                });
        } catch (err) {
            res.send({
                error: 'Connection failed'
            })
        }
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any, next: any) {
        try {
            const response = await attachBlockChainToPaymentMethod(req.body.paymentMethodId, req.body.accountId);
            res.status(201).json({
                messsage: `BTC AND ETH addresses added to payment method ${req.body.paymentMethodId}`,
                success: true,
                response: response
            });
            next()
        } catch (err) {
            res.json({
                message: err
            });
        }


    }


    static async UpdateUserDetails(req: any, res: any) {
        try {
            const accountResponse = await getAccountFromWyre(req.body.accountId);
            const paymentMethod = await getPaymentMethod(req.body.paymentMethodId, req.body.accountId);
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);
            db.collection(this.collectionName).updateOne({
                _id: 35
            },
                { "$push": { "paymentMethods": paymentMethod }, "$set": { "wyreAccount": accountResponse }, "$inc": { "version": 1 } }, { "upsert": false }
                , function (err: any, result: any) {
                    if (err) console.log(err);
                    console.log(result);
                });
        } catch (err) {
            throw new err;
        }
    }

    static async transfer(req: any, res: any, next: any) {
        try {
            const response = await createTransfer(req.body.accountId, req.body.body);
            let subscription = {"subscribeTo":`transfer:${response.id}`,"notifyTarget": `${req.hostname}:${port}/updateTransfer`};
            let dbConn2 = await this.dbConn;
            let db = dbConn2.db(this.dbName);
            db.collection(this.collectionName).updateOne({
                _id: 40
            },
                { "$push": { transactions: response }, "$inc": { "version": 1 } }, { "upsert": true }
                , async function (err: any, result: any) {
                    if (err) {
                        res.status(400).send({
                            message: 'transaction not saved in the database',
                            error: err
                        });
                    }
                    if (result) {
                        console.log(result, 'transfers saved');
                        await SubscribeToTransferChanges(req.body.accountId, subscription)
                        res.status(200).send({
                            message: 'transaction complete',
                            transfer: response
                        });
                    }
                });
        } catch (error) {
            next(error);
        }
    }

}
