const sampleResult = {
    "result": {
        "ok": 1,
        "n": 1,
        "opTime": {
            "ts": "6810711747880550401",
            "t": 2
        }
    },
    "ops": [
        {
            "id": "AC_7HJL92EQJ8X",
            "status": "OPEN",
            "type": "INDIVIDUAL",
            "country": "US",
            "createdAt": 1585742385000,
            "depositAddresses": {
                "ETH": "0x76a29f8309e28a2cdd02672a113315c5c79c39a0",
                "BTC": "mseYB9pgvYgszptAN9JTpWHGrwA8CjMRT2"
            },
            "totalBalances": {},
            "availableBalances": {},
            "profileFields": [
                {
                    "fieldType": "EMAIL",
                    "value": "johnnyquest@gmail.com",
                    "note": null,
                    "status": "APPROVED",
                    "fieldId": "individualEmail"
                },
                {
                    "fieldType": "CELLPHONE",
                    "value": "+256930939349343",
                    "note": null,
                    "status": "APPROVED",
                    "fieldId": "individualCellphoneNumber"
                },
                {
                    "fieldType": "STRING",
                    "value": "Johnny Quest",
                    "note": null,
                    "status": "PENDING",
                    "fieldId": "individualLegalName"
                },
                {
                    "fieldType": "STRING",
                    "value": null,
                    "note": null,
                    "status": "OPEN",
                    "fieldId": "individualSsn"
                },
                {
                    "fieldType": "DATE",
                    "value": "1995-05-25",
                    "note": null,
                    "status": "PENDING",
                    "fieldId": "individualDateOfBirth"
                },
                {
                    "fieldType": "ADDRESS",
                    "value": {
                        "street1": "1 Market St",
                        "street2": "Suite 402",
                        "city": "San Francisco",
                        "state": "CA",
                        "postalCode": "94105",
                        "country": "US"
                    },
                    "note": null,
                    "status": "PENDING",
                    "fieldId": "individualResidenceAddress"
                },
                {
                    "fieldType": "DOCUMENT",
                    "value": [],
                    "note": null,
                    "status": "OPEN",
                    "fieldId": "individualGovernmentId"
                },
                {
                    "fieldType": "PAYMENT_METHOD",
                    "value": null,
                    "note": "Payment method not yet submitted",
                    "status": "OPEN",
                    "fieldId": "individualSourceOfFunds"
                },
                {
                    "fieldType": null,
                    "value": [],
                    "note": null,
                    "status": "PENDING",
                    "fieldId": "individualProofOfAddress"
                }
            ],
            "_id": "5e84823e95f425336cebe972"
        }
    ],
    "insertedCount": 1,
    "insertedIds": {
        "0": "5e84823e95f425336cebe972"
    }
}

console.log(sampleResult.ops[0]);