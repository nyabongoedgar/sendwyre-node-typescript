//@ts-ignore
import express from 'express';
import AccountsController from './AccountsController';
const Router = express.Router();

Router.get(
  '/accounts',
  AccountsController.getAccount
);

Router.post(
  '/accounts',
  AccountsController.postAccount
);

Router.post(
  '/paymentMethods',
  AccountsController.createPaymentMethod
);

// Router.get(
//   '/paymentMethods',
//   AccountsController.getPaymentMethod
// );

// Router.get(
//   '/allPaymentMethods',
//   AccountsController.getAllPaymentMethods
// );

// Router.put(
//   '/accounts',
//   AccountsController.updateAccount
// );

Router.post(
  '/attachBlockChain',
  AccountsController.attachBlockChainToPaymentMethod
);

export default Router;
