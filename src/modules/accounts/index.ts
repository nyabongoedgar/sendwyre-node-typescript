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

Router.post(
  '/transfers',
  AccountsController.transfer
);

Router.get(
  '/rates',
  AccountsController.getRates
);

/** the following routes will be triggered when objects on the sendwyre db update () */
Router.post(
  '/updateAccount',
  AccountsController.updateAccountInfo
)

Router.post(
  '/updatePaymentMethod'
)

Router.post(
  '/updateTransfer'
)

export default Router;
