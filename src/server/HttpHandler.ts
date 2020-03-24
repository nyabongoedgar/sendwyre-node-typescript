import {LambdaHttpRequest, LambdaHttpResponse} from "aws-lambda-helper";
import {LambdaHttpHandler} from "aws-lambda-helper/dist/HandlerFactory";
import {AccountManagement} from "../sendwyre/accountManagement";
import {AuthenticationVerifyer, JsonRpcRequest} from "ferrum-plumbing";

export class HttpHandler implements LambdaHttpHandler {
    constructor(private AccountManagement: AccountManagement, /*private authVerifyer: AuthenticationVerifyer */) { }

    async handle(request: LambdaHttpRequest, context: any): Promise<LambdaHttpResponse> {
        
        // if (!this.authVerifyer.isValid(request.headers)) {
        //     return {
        //         body: 'Bad secret',
        //         headers: {
        //             'Access-Control-Allow-Origin': '*',
        //             'Content-Type': 'text/html',
        //         },
        //         isBase64Encoded: false,
        //         statusCode: 400,
        //     };
        // }
        let body: any = undefined;
        const req = JSON.parse(request.body) as JsonRpcRequest;
        // console.log(req.command);
        switch (req.command) {
            case 'getAccount':
                body = await this.AccountManagement.getAccount(req.data.id);
                break;
            case 'createAccount':
                body =  await this.AccountManagement.createAccount();
                break;
            case 'createPaymentMethod':
                body = await this.AccountManagement.createPaymentMethod(req.data.accountId, req.data.publicToken);
                console.log(body);
                break;
            case 'getPaymentMethod':
                body = await this.AccountManagement.getPaymentMethod(req.data.paymentMethodId, req.data.accountId);
                console.log(body);
            case 'testCreatePaymentMethod':
                body = await this.AccountManagement.testCreatePaymentMethod(req.data.accountId, req.data.publicToken)
                console.log(body)
            case 'uploadDocument':
                body = await this.AccountManagement.uploadDocument(req.data.accountId, req.data.formData)
            default:
                body = { error: 'bad request' }
        }
        return {
            body: JSON.stringify(body),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                /* 'X-Secret': process.env.KUDI_ENDPOINT_SECRET */
            },
            isBase64Encoded: false,
            statusCode: 200,
        } as LambdaHttpResponse;
    }
}