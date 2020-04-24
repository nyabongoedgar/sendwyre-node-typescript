//@ts-ignore
import express from 'express';
//@ts-ignore
import bodyParser from 'body-parser';
//@ts-ignore
import cors from 'cors';

import modules from './modules';

const app = express();

app.use(cors());

app.use(bodyParser.json());

// app.use(expressValidator());

// set base url for api
modules(app);

// catch all routers
// app.use('*', (req: any, res: any) => res.status(404).json({
//   message: 'Not Found. Use /api/v1 to access the Api'
// }));

export default app;
