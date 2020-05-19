//@ts-ignore
import express from 'express';
import AccountsController from './AccountsController';
const Router = express.Router();

Router.get(
  '/users/:userId',
  AccountsController.getUserInfo
);

Router.post(
  '/accounts',
  AccountsController.postAccount
);

Router.post(
  '/paymentMethods',
  AccountsController.createPaymentMethod
);



Router.post(
  '/attachBlockChain',
  AccountsController.attachBlockChainToPaymentMethod,
  AccountsController.UpdateUserDetails
);

// Router.post(
//   '/quoteTransfer',
//   AccountsController.quoteTransfer
// );

// Router.post(
//   '/confirmTransfer',
//   AccountsController.confirmTransfer
// )

Router.post(
  '/transfers',
  AccountsController.createTransfer
);

Router.get(
  '/rates',
  AccountsController.getRates
);

Router.get('/limits',
  AccountsController.getLimits)

/** the following routes will be triggered when objects on the sendwyre db update () */
Router.post(
  '/updateAccount',
  AccountsController.updateAccountInfo
)

Router.post(
  '/updatePaymentMethod',
  AccountsController.updatePaymentMethod
)

Router.post(
  '/updateTransfer',
  AccountsController.updateTransfer
)

export default Router;
