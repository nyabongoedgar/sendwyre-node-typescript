import accountsRouter from './accounts';


const apiPrefix = '/api/v1';

// add your route to this list
const routes = [
  accountsRouter,
];
export default (app: any) => {
  routes.forEach(route => app.use(apiPrefix, route));
  // routes.forEach(route => app.use(route));
  return app;
};
