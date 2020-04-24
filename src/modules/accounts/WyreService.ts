import * as crypto from "crypto";
import axios from "axios";
import {port} from '../../../index';

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

export async function createAccount(): Promise<any> {
    try {
        const url = `${_rootUrl}/${_accountsPrefix}?timestamp=${_timestamp}`;
        /**
       * https://docs.sendwyre.com/v3/docs/account-resource#section-fields 
       * This page has alll required fields for creating accounts for others.
       **/
        let accountDetails = {
            "type": "INDIVIDUAL",
            "country": "US",
            "subaccount": true,
            "referrerAccountId": "AC_JZRHZANBEFP",
            "profileFields": [
                {
                    fieldId: "individualLegalName",
                    value: "Johnny Quest"
                },
                {
                    fieldId: "individualCellphoneNumber",
                    value: '+256930939349-343'
                },
                {
                    fieldId: "individualEmail",
                    value: 'johnnyquest@gmail.com'
                },
                {
                    fieldId: "individualResidenceAddress",
                    value: {
                        street1: "1 Market St",
                        street2: "Suite 402",
                        city: "San Francisco",
                        state: "CA",
                        postalCode: "94105",
                        country: "US"
                    }
                },
                {
                    fieldId: "individualDateOfBirth",
                    value: '1995-05-25' //1995-05-25
                },
                // {
                //     fieldId: "individualSsn",
                //     value: ''
                // },
                {
                    fieldId: "individualSourceOfFunds",
                    // a payment method that the account holder owns.
                    value: ''
                },
                /** a utility bill or bank statement. individualProofOfAddress will start in the PENDING state as we will attempt to use the individualSourceOfFunds to fill this requirement. **/
                // ,{
                //     fieldId: "individualProofOfAddress",
                //     value: '',
                // }
            ]
        }
        const response = await axios.post(url, accountDetails, configurePostOptions(url, accountDetails))
        return response.data;
    } catch (error) {
        // console.log(error, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        // return JSON.stringify(error) 
        throw error;
    }
}

export async function uploadDocument(accountId: string, formData: any): Promise<any> {
    try {
        let fieldId = 'individualGovernmentId';
        let url = `${_rootUrl}/${_accountsPrefix}/${accountId}/${fieldId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        // const formData = new FormData();
        // formData.append('image', files[0]) //we shall get files from an api request.
        const response = await axios.post(url, formData, configurePostOptions(url, formData))
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function createPaymentMethod(accountId: string, publicToken: string) {
    // the public token is attached to a particular account that created an account
    /**Your server sends the publicToken and the user's Account ID to the Wyre API, which will connect the  Payment Method record on Wyre to the User's account (See LOCAL_TRANSFER (ACH) - Create Payment Method for this API call) **/
    try {
        let body = { publicToken: publicToken, paymentMethodType: "LOCAL_TRANSFER", country: "US" };
        let url = `${_rootUrl}/v2/paymentMethods?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.post(url, body, configurePostOptions(url, body))
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getPaymentMethod(paymentMethodId: string, accountId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) { throw error; }
}

export async function getAllPaymentMethods(accountId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethods?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url))
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// export async function paymentMethodFollowUp(accountId: string, paymentMethodId: string) {
//     try {
//         let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}/followup?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
//         let body = { waitingPrompts: [{ id: "839LFN86GTA", answer: 'Plaid Checking 0000' }] };
//         const response = await axios.post(url, configurePostOptions(url, body))
//         return response.data;
//     }
//     catch (error) {
//         console.log(error);
//     }
// }

export async function attachBlockChainToPaymentMethod(paymentMethodId: string, accountId: string) {
    try {
        let url = `https://api.testwyre.com/v2/paymentMethod/${paymentMethodId}/attach?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        let body = { blockchain: 'ALL' };
        const response = await axios.post(url, body, configurePostOptions(url, body));
        return response.data
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function createTransfer(accountId: string, body: any) {
    // the public token is attached to a particular account that created an account
    /**Your server sends the publicToken and the user's Account ID to the Wyre API, which will connect the  Payment Method record on Wyre to the User's account (See LOCAL_TRANSFER (ACH) - Create Payment Method for this API call) **/
    try {
        // let url = `${_rootUrl}/v3/transfers?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        let url = `${_rootUrl}/v3/transfers?timestamp=${_timestamp}`;
        const response = await axios.post(url, body, configurePostOptions(url, body));
        console.log(response.data, "dtaaa")
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getRates() {
    try {
        let url = `${_rootUrl}/v3/rates?pretty&as=priced`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) { throw error }
}

// making subscriptions for account, paymentMethods
export async function SubscribeToAccountChanges(accountId: string, body: any) {
    try {
        let url = `${_rootUrl}/v3/subscriptions?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        //the notifyTarget will be the url to execute an account Update
        const response = await axios.post(url, configurePostOptions(url, body));
        return response.data;
    } catch (error) { throw error }
}

export async function SubscribeToPaymentMethodChanges(accountId: string, paymentMethodId: string, body: any) {
    try {
        let url = `${_rootUrl}/v3/subscriptions?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        //the notifyTarget will be the url to execute
        const response = await axios.post(url, configurePostOptions(url, body));
        return response.data;
    } catch (error) { throw error }
}

export async function SubscribeToTransferChanges(accountId: string, body: any) {
    try {
        let url = `${_rootUrl}/v3/subscriptions?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        
        //the notifyTarget will be the url to execute
        const response = await axios.post(url, configurePostOptions(url, body));
        return response.data;
    } catch (error) { throw error }
}

export async function getAccountForUpdate(accountId: string) {
    try {
        let url = `${_rootUrl}/v3/accounts/${accountId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getAndupdateTransfer(accountId: string, transferId: string) {
    try {
        let url =`${_rootUrl}/v3/transfers/${transferId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAndupdatePaymentMethod(accountId: string, paymentMethodId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`
        const response = await axios.get(url, configureGetOptions(url));
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
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



