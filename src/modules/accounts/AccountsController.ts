import AccountsTransactions from './AccountsTransactions';
import { getRates, getLimits } from './WyreService';
class AccountsController {

    static async postAccount(req: any, res: any, next: any) {
        await AccountsTransactions.postAccountTransaction(req, res, next)
    }

    static async getUserInfo(req: any, res: any, next: any) {
        await AccountsTransactions.getUserInfoFromDb(req, res, next)
        // 0.48460408945276057
    }

    static async createPaymentMethod(req: any, res: any, next: any) {
        await AccountsTransactions.createPaymentMethod(req, res, next);
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any, next: any) {
        await AccountsTransactions.attachBlockChainToPaymentMethod(req, res, next);
    }
    static async UpdateUserDetails(req: any, res: any, next: any) {
        await AccountsTransactions.UpdateUserDetails(req, res, next);
    }

    // static async quoteTransfer(req: any, res: any, next: any) {
    //     try {
    //         const response = await quoteTransfer(req.body.accountId, req.body.transaction);
    //         res.status(200).json({
    //             quotedTransfer: response
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    // static async confirmTransfer(req: any, res: any, next: any){
    //     await AccountsTransactions.confirmTransfer(req, res, next);
    // }

    static async createTransfer(req: any, res: any, next: any) {
        await AccountsTransactions.transfer(req, res, next);
    }

    static async getDebitCardTransfer(req: any, res: any, next: any) {
        await AccountsTransactions.getDebitCardTransfer(req, res, next);
    }


    static async getRates(req: any, res: any, next: any) {
        try {
            const response = await getRates();
            res.status(200).json({
                rates: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async getLimits(req: any, res: any, next: any) {
        try {
            const response = await getLimits();
            res.status(200).json({
                limits: response
            });
        } catch (error) {
            next(error);
        }
    }



    static async updateAccountInfo(req: any, res: any, next: any) {
        await AccountsTransactions.UpdateAccountTransaction(req, res, next);
    }

    static async updatePaymentMethod(req: any, res: any, next: any) {
        await AccountsTransactions.UpdatePaymentMethod(req, res, next);
    }

    static async updateTransfer(req: any, res: any, next: any) {
        await AccountsTransactions.updateTransfer(req, res, next);
    }

}

export default AccountsController;
