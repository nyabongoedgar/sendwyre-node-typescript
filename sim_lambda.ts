require('dotenv').config();
import {handler} from '.';
import {SimulateLamdba} from 'aws-lambda-helper';

SimulateLamdba.run(8080, handler);