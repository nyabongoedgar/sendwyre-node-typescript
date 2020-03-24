import {Container, Module, SecretAuthProvider, ValidationUtils} from 'ferrum-plumbing';
import {HttpHandler} from "./HttpHandler";
import {AccountManagement} from "../sendwyre/accountManagement";
// import { AwsEnvs,SecretsProvider, MongooseConfig } from 'aws-lambda-helper';
// import {getEnv} from './utils';
// import {AccountManagement} from "../sendwyre/accountManagement"



export class ServerModule implements Module {
    async configAsync(container: Container) {
        container.register('LambdaHttpHandler',
                c => new HttpHandler(c.get(AccountManagement),/* new SecretAuthProvider(secretsHandlerConfig.secret) */)); 
        container.register("LambdaSqsHandler", () => new Object());
        container.register(AccountManagement, c => new AccountManagement());
    }
}