import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { MongoError } from 'mongodb';


import modules from './modules';

const app = express();

app.use(cors());

app.use(bodyParser.json());

// app.use(morgan('dev'));






// app.use(expressValidator());

// set base url for api
modules(app);

app.use('*', (req: any, res: any) => res.status(404).json({
    message: 'Not Found. Use /api/v1 to access the Api'
}));

app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof MongoError) {
        return res.status(503).json({
            type: 'MongoError',
            message: error.message
        });
    }
    return res.status(500).json({
        message: error.message,
    });
});



export default app;
