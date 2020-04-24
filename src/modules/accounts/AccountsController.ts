import AccountsTransactions from './AccountsTransactions';
import { getRates } from './WyreService';
class AccountsController {

    static async postAccount(req: any, res: any) {
        await AccountsTransactions.postAccountTransaction(req, res)
    }

    static async getUserInfo(req: any, res: any) {
        await AccountsTransactions.getUserInfoFromDb(req, res)
        // 0.48460408945276057
    }

    static async createPaymentMethod(req: any, res: any) {
        await AccountsTransactions.createPaymentMethod(req, res);
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any, next: any) {
        await AccountsTransactions.attachBlockChainToPaymentMethod(req, res, next);
    }
    static async UpdateUserDetails(req: any, res: any) {
        await AccountsTransactions.UpdateUserDetails(req, res);
    }

    static async transfer(req: any, res: any, next: any) {
        await AccountsTransactions.transfer(req, res, next);
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

    static async updateAccountInfo(req: any, res: any, next: any) {
        try {
            await AccountsTransactions.UpdateAccountTransaction(req, res, next);
        }
        catch (error) {
            next(error);
        }
    }

    static async updatePaymentMethod(req: any, res: any, next: any) {
        try {
            await AccountsTransactions.UpdatePaymentMethod(req, res, next);
        }
        catch (error) {
            next(error);
        }
    }

    static async updateTransfer(req: any, res: any, next: any) {
        try {
            await AccountsTransactions.UpdatePaymentMethod(req, res, next);
        }
        catch (error) {
            next(error);
        }
    }

}

export default AccountsController;
