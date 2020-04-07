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
const _timestamp = Date.now();
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

export async function getAccount(accountId: string): Promise<any> {
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
    } catch (error) { console.log(error) }
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
        console.log(error);
    }
}

export async function getPaymentMethod(paymentMethodId: string, accountId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        const response = await axios.get(url, configureGetOptions(url));
        return response.data;
    } catch (error) { console.log(error) }
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

export async function paymentMethodFollowUp(accountId: string, paymentMethodId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}/followup?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        let body = { waitingPrompts: [{ id: "839LFN86GTA", answer: 'Plaid Checking 0000' }] };
        const response = await axios.post(url, configurePostOptions(url, body))
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function updateAccount(fieldId: string, value: string, accountId: string) {
    try {
        let url = `${_rootUrl}/v3/accounts/${accountId}?masqueradeAs=${accountId}&timestamp=${_timestamp}`;
        let body = { profileFields: [{ "fieldId": fieldId, "value": value }] }
        const response = await axios.get(url, configurePostOptions(url, body))
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function attachBlockChainToPaymentMethod(paymentMethodId: string, accountId: string) {
    try {
        let url = `${_rootUrl}/v2/paymentMethod/${paymentMethodId}/attach?masqueradeAs=${accountId}&timestamp=${_timestamp}`
        let body = { blockChain: "BTC,ETH" };
        const response = await axios.get(url, configurePostOptions(url, body));
        return response.data;
    } catch (error) {
        console.log(error)
    }
}



