//@ts-ignore
import express from 'express';
import Controller from './controller';
const Router = express.Router();

Router.post(
  '/accounts',
  Controller.createAccount
);

Router.get(
  '/users/:userId',
  Controller.getUserInfo
);

Router.post(
  '/paymentMethods',
  Controller.createPaymentMethod
);

Router.post(
  '/attachBlockChains',
  Controller.attachBlockChainToPaymentMethod,
  Controller.LocalWyreAccountPaymentMethodUpdate
);


/** the following routes will be triggered when objects on the sendwyre db update () */
Router.post(
  '/updateAccounts',
  Controller.updateAccountInfo
);

Router.post(
  '/updatePaymentMethods',
  Controller.updatePaymentMethod
);

Router.post(
  '/updateLocalWyreTransfers',
  Controller.updateLocalWyreTransfer
);
/* end of update urls */
Router.post(
  '/transfers',
  Controller.createTransfer
);

Router.get(
  '/debitcards',
  Controller.getDebitCardTransfer
);

Router.get(
  '/rates',
  Controller.getRates
);

Router.get(
  '/limits',
  Controller.getLimits
);

// Router.post(
//   '/quoteTransfer',
//   Controller.quoteTransfer
// );

// Router.post(
//   '/confirmTransfer',
//   Controller.confirmTransfer
// )


export default Router;
