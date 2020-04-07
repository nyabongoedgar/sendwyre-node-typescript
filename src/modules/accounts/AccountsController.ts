import AccountsTransactions from './AccountsTransactions';

class AccountsController {

    static async postAccount(req: any, res: any) {
        await AccountsTransactions.postAccountTransaction(req, res)
    }

    static async getAccount(req: any, res: any) {
        await AccountsTransactions.getAccountTransaction(req, res, 0.48460408945276057)
        // 0.48460408945276057
    }

    static async createPaymentMethod(req: any, res: any) {
        await AccountsTransactions.createPaymentMethod(req, res);
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any) {
        await AccountsTransactions.attachBlockChainToPaymentMethod(req, res);
    }
}

export default AccountsController;
