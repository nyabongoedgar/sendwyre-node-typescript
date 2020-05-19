import * as crypto from "crypto";
import axios from "axios";
interface requestConfig {
    headers: {
        "Content-Type": string;
        "X-Api-Key": string,
        "X-Api-Signature": string
    }
}

const _rootUrl = 'https://api.testwyre.com';
const _accountsPrefix = 'v3/accounts'
const _secret = 'SK-QUQFEYN7-GPDCNVDX-E9RJNAPB-A3PZDR9N'; //this is my api secret key at testwyre.com
const _timestamp = new Date().getTime() + "000";
const _xApiKey = "AK-LFB7E96M-7P4ATP8Y-GHN3NZA9-2ZF4EDEP";


function calc_auth_sig_hash(value: any): string {
    const hash = crypto.createHmac('sha256', _secret)
        .update(value)
        .digest('hex');
    return hash;
}
function configureGetOptions(url: string): requestConfig {
    return {
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": _xApiKey,
            "X-Api-Signature": calc_auth_sig_hash(url + "")
        }
    }
}

function configurePostOptions(url: string, body: any): requestConfig {
    return {
        headers: {
            "Content-Type": "application/json",
            "X-Api-Key": _xApiKey,
            "X-Api-Signature": calc_auth_sig_hash(url + JSON.stringify(body))
        }
    }
}

export async function getAccountFromWyre(accountId: string): Promise<any> {
    try {
        let url = `${_rootUrl}/${_accountsPrefix}/${accountId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`
        const response = await axios.get(url, configureGetOptions(url))
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function createAccount(accountDetails: any): Promise<any> {
    try {
        const url = `${_rootUrl}/${_accountsPrefix}?timestamp=${_timestamp}`;
        /**
       * https://docs.sendwyre.com/v3/docs/account-resource#section-fields
       * This page has all required fields for creating accounts for others.
       **/
        const response = await axios.post(url, accountDetails, configurePostOptions(url, accountDetails))
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
        // const err = {err: response.data}
        // throw new Error(error);
        // return error;
    }
}

export async function createPaymentMethod(accountId: string, publicToken: string) {
    try {
        let body = { publicToken: publicToken, paymentMethodType: "LOCAL_TRANSFER", country: "US" };
        let url = `${_rootUrl}/v2/paymentMethods?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.post(url, body, configurePostOptions(url, body))
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

export async function getPaymentMethod(paymentMethodId: string, accountId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

// export async function getAllPaymentMethods(accountId: string) {
//     try {
//         let url = `${_rootUrl}/v2/paymentMethods?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
//         const response = await axios.get(url, configureGetOptions(url))
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function attachBlockChainToPaymentMethod(paymentMethodId: string, accountId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}/attach?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        let body = { blockchain: 'ALL' };
        const response = await axios.post(url, body, configurePostOptions(url, body));
        return response.data
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

export async function createTransfer(accountId: string, body: any) {
    try {
        console.log('in the transfer')
        let url = `${_rootUrl}/v3/transfers?timestamp=${_timestamp}`;
        // let url = `${_rootUrl}/v3/transfers?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.post(url, body, configurePostOptions(url, body));
        console.log(response.data, 'tran data')
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        console.log(errorObject);
        throw errorObject;
    }
}


// AC_JZRHZANBEFP

// export async function quoteTransfer(accountId: string, body: any) {
//     try {
//         // let url = `${_rootUrl}/v3/transfers?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
//         let url = `${_rootUrl}/v3/transfers?timestamp=${_timestamp}`;
//         console.log(url, 'url in transfer');
//         const response = await axios.post(url, body, configurePostOptions(url, body));
//         console.log(url, "url create transfer", response)
//         return response.data;
//     } catch (error) {
//         let errorObject = error.response.data;
//         console.log(errorObject);
//         throw errorObject;
//     }
// }

// /**
//  * The result of this confirmation is what we post in the database
//  * @param accountId
//  * @param transferId
//  */
// export async function confirmTransfer(accountId: string, transferId: string) {
//     try {
//         // let url = `${_rootUrl}/v3/transfers/${transferId}/confirm?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
//         let url = `${_rootUrl}/v3/transfers/${transferId}/confirm?timestamp=${_timestamp}`;
//         const response = await axios.post(url, {}, configurePostOptions(url, {}));
//         console.log(response.data, 'this transaction has thus been approved !>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
//         return response.data
//     } catch (error) {
//         let errorObject = error.response.data;
//         console.log(errorObject, 'this transaction has not been approved in the confirmation');
//         throw errorObject;
//     }

// }

export async function getRates() {
    try {
        let url = `${_rootUrl}/v3/rates?pretty&as=priced`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

export async function getLimits() {
    try {
        let url = `${_rootUrl}/v3/limits?timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

/**
 * making subscriptions for account */
export async function SubscribeToAccountChanges(accountId: string, body: any) {
    try {
        let url = `${_rootUrl}/v3/subscriptions?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        //the notifyTarget will be the url to execute an account Update
        const response = await axios.post(url, body, configurePostOptions(url, body));
        console.log(response.data, 'account subscription');
        return response.data;
    } catch (error) {
        console.log('Error in the account subscription object', error)
        let errorObject = error.response.data;
        throw errorObject;;
    }
}
/**
 * making subscriptions for paymentMethods */
export async function SubscribeToPaymentMethodChanges(accountId: string, body: any) {
    try {
        let url = `${_rootUrl}/v3/subscriptions?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        //the notifyTarget will be the url to execute
        const response = await axios.post(url, body, configurePostOptions(url, body));
        console.log(response.data, 'payment method subscription');
        return response.data;
    } catch (error) {
        console.log('Error in the account subscription object', error);
        let errorObject = error.response.data;
        throw errorObject;
    }
}

/**
 * making subscriptions for transfers */
export async function SubscribeToTransferChanges(accountId: string, body: any) {
    try {
        let url = `${_rootUrl}/v3/subscriptions?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        //the notifyTarget will be the url to execute
        const response = await axios.post(url, body, configurePostOptions(url, body));
        console.log(url, 'url subscription');
        return response.data;
    } catch (error) {
        console.log('Error in the Transfer subscription object', error);
        let errorObject = error.response.data;
        console.log(errorObject)
        throw errorObject;
    }
}

export async function getAccountForUpdate(accountId: string) {
    try {
        let url = `${_rootUrl}/v3/accounts/${accountId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

export async function getAndupdateTransfer(accountId: string, transferId: string) {
    try {
        let url = `${_rootUrl}/v3/transfers/${transferId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}

export async function getAndupdatePaymentMethod(accountId: string, paymentMethodId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`
        const response = await axios.get(url, configureGetOptions(url));
        console.log(response.data)
        return response.data;
    } catch (error) {
        let errorObject = error.response.data;
        throw errorObject;
    }
}


/*
Body Params
source:	string
An SRN representing an account that the funds will be retrieved from

sourceAmount:
required
double
The amount to withdrawal from the source, in units of sourceCurrency. Only include sourceAmount OR destAmount, not both.

sourceCurrency:
required
string
The currency (ISO 3166-1 alpha-3) to withdrawal from the source wallet

dest:
required
string
An email address, cellphone number, digital currency address or bank account to send the digital currency to. For bitcoin address use "bitcoin:[address]". Note: cellphone numbers are assumed to be a US number, for international numbers include a '+' and the country code as the prefix.

destAmount:
required
double
Specifies the total amount of currency to deposit (as defined in depositCurrency). Only include sourceAmount OR destAmount, not both.

destCurrency:
required
string
The currency (ISO 3166-1 alpha-3) to deposit. if not provided, the deposit will be the same as the withdrawal currency (no exchange performed)

message:	string
An optional user visible message to be sent with the transaction.

notifyUrl:	string
An optional url that Wyre will POST a status callback to (see Subscribe Webhook for more information)

autoConfirm:	boolean
An optional parameter to automatically confirm the transfer order.

customId:	string
an optional custom ID to tag the transfer

amountIncludesFees:	boolean
Optional. When true, the amount indicated (source or dest) will be treated as already including the fees

preview:	boolean
creates a quote transfer object, but does not execute a real transfer.

muteMessages:	boolean
When true, disables outbound emails/messages to the destination
*/



