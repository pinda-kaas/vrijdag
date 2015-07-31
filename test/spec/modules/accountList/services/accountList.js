(function() {
    'use strict';

    xdescribe('Service: accountList service tests', function() {
        var _accountListService;
        var emptyObj = {};
        var rootScope;
        var httpBackend;
        var _configurationConstantsService;
        var _errorService;
        var _angularCacheFactory,standardError;
        var _q;
        //excuted before each "it" is run.
        beforeEach(function() {

            //load the module.
            module('PersonalBanking');

            //inject your service for testing.
            inject(function(accountListService, $rootScope, $q, $httpBackend, configurationConstantsService, errorService, $angularCacheFactory) {
                _accountListService = accountListService;
                rootScope = $rootScope;
                httpBackend = $httpBackend;
                _configurationConstantsService = configurationConstantsService;
                _errorService = errorService;
                _angularCacheFactory = $angularCacheFactory;
                _q = $q;
            });
            standardError = {
                data:{},
                error:[
                  {
                    'code':'service',
                    'message':'sample error'
                  }
                ]
            };
        });

        it('should have an initialiseAndPrefetch function', function() {
            expect(angular.isFunction(_accountListService.initialiseAndPrefetch)).toBe(true);
        });

        it('should have an constructAccountList function', function() {
            expect(angular.isFunction(_accountListService.constructAccountList)).toBe(true);
        });

        it('should getFacilityList return a list of facilities', function() {
            var facilities = {data: [{
                        "id": "1001146922",
                        "productName": "facility name",
                        "balance": 12146.16,
                        "availableFunds": 3941.22,
                        "accounts": [
                            {
                                "id": "84804d6580a1dfdf791616db5a6f3c0e77203e4c",
                                "accountNumber": "0000293389"
                            }
                        ]
                    }]};

            httpBackend.when("GET", /account\/v3-alpha\/facilities/).respond(200, facilities);

            var result;
            var promise = _accountListService.getFacilityList();

            promise.then(function(data) {
                result = data;
            });
            rootScope.$apply();
            httpBackend.flush();
            expect(result[0].facilityNumber).toBe('1001146922');
        });

        it('should getAccountList return a list of accounts', function() {

            var facilities = {data: [{
                        "id": "1001146922",
                        "productName": "facility name",
                        "balance": 12146.16,
                        "availableFunds": 3941.22,
                        "accounts": [
                            {
                                "id": "84804d6580a1dfdf791616db5a6f3c0e77203e4c",
                                "accountNumber": "0000293101303"
                            },
                            {
                                "id": "84804d6580a1dfdf791616db5a6f3c0e77203e4c",
                                "accountNumber": "0000293149188"
                            }
                        ]
                    }]};

            var accountList = {
                "total": 2,
                "limit": 10,
                "offset": 0,
                "data": [
                    {
                        "repaymentType": "snqnhjroxpz",
                        "className": "znlnuynlkofmwzp",
                        "linkedOffsetAccountNumber": "00002938253",
                        "position": {
                            "balance": 974.65,
                            "arrears": 949.95,
                            "availableRedraw": 631,
                            "unclearedFunds": 270.59,
                            "creditLimit": 100.2,
                            "overLimit": 763.21,
                            "canRedraw": true,
                            "overLimitIndicator": false
                        },
                        "interest": {
                            "rateType": "FIXED",
                            "rate": 5.18,
                            "accruedToDate": 36.82,
                            "creditByOffset": 617.82,
                            "net": 42.47,
                            "currentYtd": 929.92,
                            "previousYtd": 554.23,
                            "interestInAdvance": true,
                            "interestOnly": true
                        },
                        "relatedAccounts": "mivxwsbxnhlupjai",
                        "permissions": {
                            "canRedraw": true,
                            "canTransact": true,
                            "canFundsTransfer": false,
                            "canBpay": false,
                            "canScheduleFundsTransfer": false,
                            "canScheduleBpay": false
                        },
                        "flags":{
                            "isOffsetAccount":true,
                            "isInArrears": false,
                            "hasStuckDirectDebit": false,
                            "isInHardship": false,
                            "hasNoRepayment": true,
                            "hasFutureTransaction": true
                        },
                        "accountNumber": "0000293149188",
                        "accountType": "mortgage",
                        "balance": 980.71,
                        "repayment": {
                            "repaymentAmount": 342.20,
                            "repaymentType": "snqnhjroxpz"
                        },
                        "product": {
                            "productKey": "unnabcqkbjx",
                            "productType": "tfghntjxlbnuoa",
                            "productName": "renb",
                            "canBpay": true,
                            "canFundsTransfer": false
                        },
                        "nickname": "my account",
                        "id": "79954ab5f4db78fee7c3a9c3694f32ee225c8a53"
                    },
                    {
                        "repaymentType": "x",
                        "className": "ksacftdtanuhpbmxnv",
                        "linkedOffsetAccountNumber": "000029362732",
                        "position": {
                            "balance": 2.42,
                            "arrears": 165.69,
                            "availableRedraw": 842.75,
                            "unclearedFunds": 831.38,
                            "creditLimit": 132.87,
                            "overLimit": 811.7,
                            "canRedraw": true,
                            "overLimitIndicator": false
                        },
                        "interest": {
                            "rateType": "VAR",
                            "rate": 6.83,
                            "accruedToDate": 25.36,
                            "creditByOffset": 33.14,
                            "net": 915.46,
                            "currentYtd": 599.25,
                            "previousYtd": 749.74,
                            "interestInAdvance": false,
                            "interestOnly": true
                        },
                        "relatedAccounts": "gaaawvsyoawqiq",
                        "permissions": {
                            "canRedraw": true,
                            "canTransact": true,
                            "canFundsTransfer": false,
                            "canBpay": false,
                            "canScheduleFundsTransfer": false,
                            "canScheduleBpay": false
                        },
                        "accountNumber": "0000293137195",
                        "accountType": "mortgage",
                        "balance": 580.45,
                        "repayment": {
                            "repaymentAmount": 100.20,
                            "repaymentType": "Interest only",
                            "estimatedRepaymentAmount": 50
                            
                        },
                        "product": {
                            "productKey": "h",
                            "productType": "wpfcziucsuqfmkzi",
                            "productName": "dhwqeinfyuhzdkyfli",
                            "canBpay": true,
                            "canFundsTransfer": false
                        },
                        "flags": {
                            "isOffsetAccount": false,
                            "isInArrears": false,
                            "hasStuckDirectDebit": false,
                            "isInHardship": false,
                            "hasNoRepayment": true,
                            "hasFutureTransaction": false
                        },
                        "nickname": "mortgage account",
                        "id": "4a79a751951dda8be0268af958137e7e1243eb15"
                    },
                    {
                        "accountType": "credit_card",
                        "accountNumber": "0000293137195",
                        "nickname": "Test Credit Card",
                        "position": {
                            "balance": 100.00,
                            "availableFunds": 9100.00,
                            "creditLimit": 10000
                        },
                        "interest": {
                            "nominalPurchaseInterestRate": 16.5
                        },
                        "repayment": {
                            "minimumRepayment": 16.5,
                            "repaymentDueDate": '2014-04-01'
                        },
                        "product": {
                            "productKey": "h",
                            "productType": "wpfcziucsuqfmkzi",
                            "productName": "A Credit Card",
                            "canBpay": true,
                            "canFundsTransfer": false,
                            "hasRewards": true,

                            "balanceTransferPromoCode": {
                                "interestRate": 1.99,
                                "duration": 9
                            }
                        },
                        "id": "Crd-4a79a751951dda8be0268af958137e7e1243eb15"
                    },
                    {
                        "bsb": "059798",
                        "repaymentType": "gkwfcknmdqex",
                        "className": "slvogaktexmfwghh",
                        "isOffsetAccount": true,
                        "linkedOffsetAccountNumber": "000029348516",
                        "position": {
                            "balance": 675.04,
                            "arrears": 480.11,
                            "availableRedraw": 876.05,
                            "unclearedFunds": 661.28,
                            "creditLimit": 87.98,
                            "overLimit": 325.07,
                            "canRedraw": true,
                            "overLimitIndicator": false
                        },
                        "interest": {
                            "rateType": "FIXED",
                            "rate": 6.92,
                            "accruedToDate": 645.14,
                            "creditByOffset": 394.28,
                            "net": 901.8,
                            "currentYtd": 873.73,
                            "previousYtd": 885.54,
                            "interestInAdvance": true,
                            "interestOnly": true
                        },
                        "borrowers": [
                            {
                                "title": "Ms",
                                "firstName": "Jane",
                                "middleName": "T",
                                "lastName": "Nicholson",
                                "type": "organization"
                            },
                            {
                                "title": "Mr",
                                "firstName": "Bob",
                                "middleName": "R",
                                "lastName": "Black",
                                "type": "organization"
                            },
                            {
                                "title": "Mr",
                                "firstName": "George",
                                "middleName": "A",
                                "lastName": "Badman",
                                "type": "individual"
                            }
                        ],
                        "relatedParties": [
                            {
                                "title": "Mr",
                                "firstName": "Dick",
                                "middleName": "S",
                                "lastName": "Househusband",
                                "type": "individual"
                            }
                        ],
                        "relatedAccounts": "in",
                        "nominatedAccounts": [
                            {
                                "paymentType": "funds-transfer",
                                "description": "h",
                                "billerCode": "bfsmfewcjaqgdwuhne",
                                "reference": "zefbctykpwyjujkm",
                                "bsb": "061321",
                                "accountNumber": "0000293101303",
                                "accountName": "bild",
                                "nominationType": "myvmkwnzaf"
                            }
                        ],
                        "permissions": {
                            "canRedraw": "vycmunhycgxwvtok",
                            "canTransact": false,
                            "canFundsTransfer": false,
                            "canBpay": false,
                            "canScheduleFundsTransfer": false,
                            "canScheduleBpay": false
                        },
                        "securities": [
                            {
                                "type": "correspondence",
                                "country": "AUS",
                                "line1": "114 George Street",
                                "line2": "",
                                "suburb": "Hurstville",
                                "state": "NSW",
                                "postcode": "2001"
                            },
                            {
                                "type": "primary",
                                "country": "AUS",
                                "line1": "116 Pitt Street",
                                "line2": "",
                                "suburb": "Sydney",
                                "state": "NSW",
                                "postcode": "2089"
                            }
                        ],
                        "accountNumber": "0000293101303",
                        "accountType": "mortgage",
                        "repayment": {
                            "repaymentAmount": 100,
                            "repaymentType": "Interest Only"
                        },
                        "product": {
                            "productKey": "af",
                            "productType": "hhoajjjnsywlngv",
                            "productName": "ppwcyyhyvvj",
                            "canBpay": false,
                            "canFundsTransfer": true
                        },
                        "flags": {
                            "isOffsetAccount": false,
                            "isInArrears": false,
                            "hasStuckDirectDebit": false,
                            "isInHardship": false,
                            "hasNoRepayment": true
                        },
                        "nickname": "",
                        "id": "MRG-004f34164b8b5273fbed539641fb6c9111d7ca34"
                    },
                    {
                        "id": "SAV-1111111111111111111111111111111111111111",
                        "bsbCode" : "012432",
                        "nickname" : "My Nicknamed Saving 1",
                        "position": {
                            "balance": 481.45,
                            "availableBalance": 481.45
                        },
                        "interest": {
                            "rate": 3.5,
                            "currentYtd": 3.6,
                            "previousYtd" : 3.6
                        },
                        "accountName": {
                            "title": "Mr",
                            "type": "individual",
                            "firstName": "first name",
                            "middleName": "middle name",
                            "lastName": "last name",
                            "suffix": "suffix"
                        },
                        "flags": {
                            "isStopped": false
                        },
                        "product": {
                            "productKey": "SV001MBLSAV001",
                            "productName": "Macquarie Savings Account"
                        },
                        "openDate" : "",
                        "closeDate" : "",
                        "status" : "open",
                        "accountNumber": "00002934561",
                        "accountType": "core"
                    },
                    {
                        "id": "SAV-1111111111111111111111111111111111111112",
                        "bsbCode" : "012432",
                        "nickname" : "Terminated Saving 2",
                        "position": {
                            "balance": 100.45,
                            "availableBalance": 100.45
                        },
                        "accountName": {
                            "title": "Mr",
                            "type": "individual",
                            "firstName": "first name",
                            "middleName": "middle name",
                            "lastName": "last name",
                            "suffix": "suffix"
                        },
                        "flags": {
                            "isStopped": true
                        },
                        "product": {
                            "productKey": "SV001MBLSAV001",
                            "productName": "Macquarie Savings Account"
                        },
                        "openDate" : "",
                        "closeDate" : "",
                        "status" : "closed",
                        "accountNumber": "00002931454",
                        "accountType": "core"
                    }
                ],
                "took": 0
            };

            var contacts = {
                "error": [],
                "data": [
                    {
                      "accountId": "MRG-004f34164b8b5273fbed539641fb6c9111d7ca34",
                      "type": "individual",
                      "homePhone": "03 8300 6980",
                      "mobilePhone": "+0418107385",
                      "email": "TEST_sstragos@optusnet.com",
                      "address": {
                        "country": "Australia",
                        "suburb": "Pascoe Vale",
                        "state": "VIC",
                        "postcode": "3044",
                        "type": "domestic",
                        "line1": "62 Landells Road"
                      },
                      "workPhone": "0418 319 509"
                    },
                    {
                      "accountId": "4a79a751951dda8be0268af958137e7e1243eb15",
                      "type": "individual",
                      "homePhone": "03 8300 6980",
                      "mobilePhone": "+0418107385",
                      "email": "TEST_sstragos@optusnet.com",
                      "address": {
                        "country": "Australia",
                        "suburb": "Pascoe Vale",
                        "state": "VIC",
                        "postcode": "3044",
                        "type": "domestic",
                        "line1": "62 Landells Road"
                      },
                      "workPhone": "0418 319 509",
                      "fax": "02 84637587"
                    }
                ]
            };
            
            var cashAccountList = {data:[
                {
                    "accountType": "cash",
                    "accountNumber": "000123456789",
                    "nickname": "Test Cash",
                    "position": {
                        "balance": 5546.04,
                        "availableBalance": 3877.16
                    },
                    "interest": {
                        "rate": 2.5,
                        "currentYtd": 501.69
                    },
                    "product": {
                       "productKey": "CMH",
                       "productName": "CASH MANAGEMENT ACCOUNT"
                    },
                    "id": "4a79a751951dda8be0268af958137e7e1243eb12"
                }],
                error:[]
            };
            
            httpBackend.when("GET", /account\/v3\/facilities/).respond(200, facilities);
            httpBackend.when("GET", /account\/v3\/accounts/).respond(200, accountList);
            httpBackend.when("GET", /account\/v3\/partial-accounts/).respond(200, cashAccountList);

            var result;
            _accountListService.constructAccountList().then(function(data) {
                result = data;
            });
            rootScope.$apply();
            httpBackend.flush();
            expect(result[0].accountNumber).toBe('0000293149188');
            expect(result[0].hasFutureTransaction).toBe(true);
            expect(result[1].hasFutureTransaction).toBe(false);
            expect(result[1].repaymentAmount).toBe(50);
            expect(result.length).toBe(6);
            expect(result[2].accountNumber).toBe('0000293137195');
            expect(result[2].balanceTransferDuration).toBe(9);
            expect(result[2].balanceTransferInterestRate).toBe(1.99);
            expect(result[5].accountNumber).toBe("000123456789");
            expect(result[5].nickname).toBe("Test Cash");
        });
        
        it('should getAccountList report error', function(){
            var accountList = {data:[
            
                    {
                        "accountType": "credit_card",
                        "accountNumber": "0000293137195",
                        "nickname": "Test Credit Card",
                        "position": {
                            "balance": 100.00,
                            "availableFunds": 9100.00,
                            "creditLimit": 10000
                        },
                        "interest": {
                            "nominalPurchaseInterestRate": 16.5
                        },
                        "repayment": {
                            "minimumRepayment": 16.5,
                            "repaymentDueDate": '2014-04-01'
                        },
                        "product": {
                            "productKey": "h",
                            "productType": "wpfcziucsuqfmkzi",
                            "productName": "A Credit Card",
                            "canBpay": true,
                            "canFundsTransfer": false,
                            "balanceTransferPromoCode": {
                                "interestRate": 1.99,
                                "duration": 9
                            }
                        },
                        "id": "4a79a751951dda8be0268af958137e7e1243eb15"
                    }],
                    error:[]
                    };
            

            var cashAccountList = {data:[
                    {
                        "accountType": "cash",
                        "accountNumber": "000123456789",
                        "nickname": "Test Cash",
                        "position": {
                            "balance": 5546.04,
                            "availableBalance": 3877.16
                        },
                        "interest": {
                            "rate": 2.5,
                            "currentYtd": 501.69
                        },
                        "product": {
                            "productKey": "CMH",
                            "productName": "CASH MANAGEMENT ACCOUNT"
                        },
                        "id": "4a79a751951dda8be0268af958137e7e1243eb12"
                    }],
                    error:[]
                    };
            
            httpBackend.when("GET", /account\/v3\/facilities/).respond(400, standardError);
            httpBackend.when("GET", /account\/v3\/partial-accounts/).respond(200, cashAccountList);
            httpBackend.when("GET", /account\/v3\/accounts/).respond(200, accountList);
          //  var getFacilityListDeferred = $q.defer();
           // getFacilityListDeferred.reject([{code:'service','message':"Something wrong"}]);
           // spyOn(_accountListService, 'getFacilityList').andReturn(getFacilityListDeferred.promise);
            var result;
            _accountListService.constructAccountList().then(function(data) {
                result=data;
            });
            rootScope.$apply();
            httpBackend.flush();

            expect(result[0].accountNumber).toBe('0000293137195');
            expect(result[1].accountNumber).toBe('000123456789');
        });


        it('should handle error when retrieving account list', function(){
            var accountList = {data:[
                {
                    "accountType": "credit_card",
                    "accountNumber": "0000293137195",
                    "nickname": "Test Credit Card",
                    "position": {
                        "balance": 100.00,
                        "availableFunds": 9100.00,
                        "creditLimit": 10000
                    },
                    "interest": {
                        "nominalPurchaseInterestRate": 16.5
                    },
                    "repayment": {
                        "minimumRepayment": 16.5,
                        "repaymentDueDate": '2014-04-01'
                    },
                    "product": {
                        "productKey": "h",
                        "productType": "wpfcziucsuqfmkzi",
                        "productName": "A Credit Card",
                        "canBpay": true,
                        "canFundsTransfer": false
                    },
                    "id": "4a79a751951dda8be0268af958137e7e1243eb15"
                }],
                error:[]
            };

            httpBackend.when("GET", /account\/v3\/facilities/).respond(400, standardError);
            httpBackend.when("GET", /account\/v3\/accounts/).respond(400, standardError);
            httpBackend.when("GET", /account\/v3\/partial-accounts/).respond(400, standardError);
            var result;
            _accountListService.constructAccountList().then(function(data) {
                result=data;
            }, function(errors) {
                result=errors;
            });
            rootScope.$apply();
            httpBackend.flush();

            expect(result[0].code).toBe('service');
        });

        it('getEligibleProducts returns eligible products', function() {
            var response = {
                data: [
                    { type: 'type', applicationFormUrl: 'url', applicationFormType: 'form type' }
                ]
            };

            var url = _configurationConstantsService.webServiceUrl.getFeatures('id');
            httpBackend.whenGET(url).respond(200, response);

            var result = [];
            _accountListService.getEligibleProducts('id').then(function(data) {
                result = data;
            });

            rootScope.$apply();
            httpBackend.flush();

            expect(result).toEqual([{type: 'type', url: 'url', formType: 'form type'}]);
        });

        it('getEligibleProducts handles service error', function() {
            var url = _configurationConstantsService.webServiceUrl.getFeatures('id');
            httpBackend.whenGET(url).respond(500, standardError);

            var result = [];
            _accountListService.getEligibleProducts('id').then(
                function() {}, 
                function(errors) {
                    result = errors;
                }
            );

            rootScope.$apply();
            httpBackend.flush();

            expect(result[0].code).toBe(standardError.error[0].code);
        });

    });
}());