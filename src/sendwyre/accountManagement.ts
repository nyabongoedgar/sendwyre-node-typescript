import * as crypto from "crypto";
import axios from "axios";
import {Injectable, ConsoleLogger} from "ferrum-plumbing";

interface requestConfig {
    headers: {
        "Content-Type": string;
        "X-Api-Key": string,
        "X-Api-Signature": string
    }
}

// interface AccountFields {
//     type: "INDIVIDUAL" | "BUSINESS";
//     country: string;
//     subaccount: boolean;
//     referrerAccountId?: string;
//     disableEmail?: boolean;
//     profileFields: []
// }

export class AccountManagement implements Injectable {

    constructor() { }

    __name__(): string { return 'AccountManagement'; }

    private _rootUrl = 'https://api.testwyre.com';
    private _accountsPrefix = 'v3/accounts'
    private _secret = 'SK-QUQFEYN7-GPDCNVDX-E9RJNAPB-A3PZDR9N'; //this is my api secret key at testwyre.com
    private _timestamp = Date.now();
    private _xApiKey = "AK-LFB7E96M-7P4ATP8Y-GHN3NZA9-2ZF4EDEP";


    calc_auth_sig_hash(value: any): string {
        const hash = crypto.createHmac('sha256', this._secret)
            .update(value)
            .digest('hex');
        return hash;
    }
    configureGetOptions(url: string): requestConfig {
        return {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this._xApiKey,
                "X-Api-Signature": this.calc_auth_sig_hash(url + "")
            }
        }
    }

    configurePostOptions(url: string, body: any): requestConfig {
        return {
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": this._xApiKey,
                "X-Api-Signature": this.calc_auth_sig_hash(url + JSON.stringify(body))
            }
        }
    }

    async getAccount(accountId: string): Promise<any> {
        let url = `${this._rootUrl}/${this._accountsPrefix}/${accountId}?masqueradeAs=${accountId}&timestamp=${this._timestamp}`
        const response = await axios.get(url, this.configureGetOptions(url))
            .then(response => response.data)
            .catch(error => console.log(error));
        return response;
    }

    async createAccount(): Promise<any> {
        const url = `${this._rootUrl}/${this._accountsPrefix}?timestamp=${this._timestamp}`;
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

        const response = await axios.post(url, accountDetails, this.configurePostOptions(url, accountDetails))
            .then(response => response.data)
            .catch(error => console.log(`Error message: ${error}`));
        return response;
    }

    async uploadDocument(accountId: string, formData: any): Promise<any> {
        let fieldId = 'individualGovernmentId';
        let url = `${this._rootUrl}/${this._accountsPrefix}/${accountId}/${fieldId}?masqueradeAs=${accountId}&timestamp=${this._timestamp}`;
        // const formData = new FormData();
        // formData.append('image', files[0]) //we shall get files from an api request.
        const response = await axios.post(url, formData, this.configurePostOptions(url, formData))
            .then(response => response.data)
            .catch(error => console.log(error));
        return response;
    }

    async createPaymentMethod(accountId: string, publicToken: string) {
        // the public token is attached to a particular account that created an account
        /**Your server sends the publicToken and the user's Account ID to the Wyre API, which will connect the  Payment Method record on Wyre to the User's account (See LOCAL_TRANSFER (ACH) - Create Payment Method for this API call) **/
        // let body = { plaidPublicToken: publicToken, paymentMethodType: "DEBIT_CARD", country: "US"};
        // the body above returns a link type of unknown
        let body = { plaidPublicToken: publicToken, paymentMethodType: "LOCAL_TRANSFER", country: "US"};
        let url = `${this._rootUrl}/v2/paymentMethods?masqueradeAs=${accountId}&timestamp=${this._timestamp}`;
        const response = await axios.post(url, body, this.configurePostOptions(url, body))
            .then(response => response.data)
            .catch(error => console.log(error));
        return response;
    }

    async getPaymentMethod(paymentMethodId: string, accountId: string){
        let url = `https://api.testwyre.com/v2/paymentMethod/${paymentMethodId}?masqueradeAs=${accountId}&timestamp=${this._timestamp}`;
        const response = await axios.get(url, this.configureGetOptions(url))
            .then(response => response.data)
            .catch(error => console.log(error));
        return response;
    }

    async attachBlockChainAddressToPaymentMethod(blockChain: 'BTC' | 'ETH', publicToken: string) {
        // the public token is attached to a particular account that created an account
        /**Your server sends the publicToken and the user's Account ID to the Wyre API, which will connect the  Payment Method record on Wyre to the User's account (See LOCAL_TRANSFER (ACH) - Create Payment Method for this API call) **/
        // let body = { publicToken: publicToken, paymentMethodType: "DEBIT_CARD", country: "US"};\
        let body = {
            "paymentMethodType":"INTERNATIONAL_TRANSFER",
            "country": "US",
            "currency": "USD",
            "beneficiaryType": "INDIVIDUAL",
            "beneficiaryAddress": "112 Brannan St",
            "beneficiaryCity": "San Francisco",
            "beneficiaryState": "CA",
            "beneficiaryPostal": "94105",
            "beneficiaryPhoneNumber": "+256930939349-343",
            "paymentType" : "DEBIT_CARD",
            "fullName": "Johnny Quest",
            "nickname" : "My Visa Card",   
            "accountNumber" : accountId,       
            "expirationDate": "2020-05-25",
            "chargeablePM": "true",
            "firstNameOnAccount": "Johnny",
            "lastNameOnAccount": "Quest",
            "routingNumber": "0000",
            "accountType": "checking"
        }
        let url = `${this._rootUrl}/v2/paymentMethods?masqueradeAs=${accountId}&timestamp=${this._timestamp}`;
        const response = await axios.post(url, body, this.configurePostOptions(url, body))
            .then(response => response.data)
            .catch(error => console.log(error));
        return response;
    }
}