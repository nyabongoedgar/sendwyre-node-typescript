import {LambdaGlobalContext} from "aws-lambda-helper";
import {ServerModule} from "./src/server/ServerModule";
require('dotenv').config();

export async function handler(event: any, context: any) {
        const container = await LambdaGlobalContext.container();
        await container.registerModule(new ServerModule());
        const lgc = container.get<any>(LambdaGlobalContext);
        return await lgc.handleAsync(event, context);
}
