//@ts-ignore
import axios from 'axios';
import {createAccount, getAccount, createPaymentMethod, updateAccount, attachBlockChainToPaymentMethod, getPaymentMethod, getAllPaymentMethods} from "./AccountsUtils";
// dotenv.config();
import AccountsTransactions from './AccountsTransactions';

class AccountsController {

    static async postAccount(req: any, res: any) {
       await AccountsTransactions.postAccountTransaction(req, res)
    }
    
    static async getAccount(req: any, res: any) {
        await AccountsTransactions.getAccountTransaction(req, res, 0.48460408945276057)  
    }

    static async createPaymentMethod(req: any, res: any){
        try{
            const response = await createPaymentMethod(req.body.accountId, req.body.publicToken);
            res.json({
                "paymentMethod": response
            })
        }
        catch(error){
            console.log(error);
        }
    }

    static async getPaymentMethod(req: any, res: any){
        try{
            const response = await getPaymentMethod(req.body.paymentMethodId, req.body.accountId);
            res.status(200).json({
                response
            })
        }catch(error){
            console.log(error);
        }
    }

    static async getAllPaymentMethods(req: any, res: any){
        try{
            const response = await getAllPaymentMethods(req.body.accountId);
            res.status(200).json({
                response
            })
        }catch(error){}
    }
    static async updateAccount(req: any, res: any){
        try{
            const response = await updateAccount(req.body.fieldId, req.body.value, req.body.accountId)
            res.json({
                "paymentMethod": response
            })
        }
        catch(error){
            console.log(error);
        }
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any){
        try{
            const response = await attachBlockChainToPaymentMethod(req.body.blockChain, req.body.paymentMethodId, req.body.accountId);
            res.status(200).json({
                response
            });
        }catch(error){
            console.log(error)
        }
    }
    
}

export default AccountsController;
