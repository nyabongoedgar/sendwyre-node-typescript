import Model from './model';
import { getRates, getLimits } from './WyreService';
class Controller {

    static async createAccount(req: any, res: any, next: any) {
        await Model.saveAccount(req, res, next)
    }

    static async getUserInfo(req: any, res: any, next: any) {
        await Model.getUserInfoFromDb(req, res, next)
        // 0.48460408945276057
    }

    static async createPaymentMethod(req: any, res: any, next: any) {
        await Model.createPaymentMethod(req, res, next);
    }

    static async attachBlockChainToPaymentMethod(req: any, res: any, next: any) {
        await Model.attachBlockChainToPaymentMethod(req, res, next);
    }
    static async LocalWyreAccountPaymentMethodUpdate(req: any, res: any, next: any) {
        await Model.LocalWyreAccountPaymentMethodUpdate(req, res, next);
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
    //     await Model.confirmTransfer(req, res, next);
    // }

    static async createTransfer(req: any, res: any, next: any) {
        await Model.createTransfer(req, res, next);
    }

    static async getDebitCardTransfer(req: any, res: any, next: any) {
        await Model.getDebitCardTransfer(req, res, next);
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
        await Model.updateLocalWyreAccount(req, res, next);
    }

    static async updatePaymentMethod(req: any, res: any, next: any) {
        await Model.UpdateLocalWyrePaymentMethod(req, res, next);
    }

    static async updateLocalWyreTransfer(req: any, res: any, next: any) {
        await Model.updateLocalWyreTransfer(req, res, next);
    }

}

export default Controller;
