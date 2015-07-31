xdescribe("Unit: Testing Controllers", function() {
    var _accountListCtrl, _scope, _rootScope, _http, _timeout, _accountListService, _errorService, _eventsService, _notificationService;

    beforeEach(function() {

        //load the module.
        module('PersonalBanking');

        //inject your service for testing.
        inject(function($rootScope, $controller, $http, $timeout, accountListService, errorService, $q, eventsService, notificationService, httpCacheService) {
            _controller = $controller;
            _scope = $rootScope.$new();
            _rootScope = $rootScope;
            _http = $http;
            _timeout = $timeout;
            _accountListService = accountListService;
            _errorService = jasmine.createSpyObj('errorService', ['displayErrors', 'clearErrors', 'setError']);
            _eventsService = eventsService;
            _notificationService = jasmine.createSpyObj('notificationService', ['addAlert']);
            var getAccountListDeferred = $q.defer();

            var accounts = [
                {
                    newNickname: 'new nickname',
                    nickname: 'old nickname',
                    accountNumber: 'XXXX XXXX XXXX 1234',
                    id: '1',
                    nameNickname: 'old nickname',
                    productName: 'product name'
                },
                {
                    newNickname: 'new nickname',
                    nickname: 'old nickname',
                    accountNumber: 'XXXX XXXX XXXX 1235',
                    id: '2',
                    nameNickname: 'old nickname',
                    productName: 'product name'
                }
            ];
            getAccountListDeferred.resolve(accounts);

            spyOn(_accountListService, 'getAccountList').andReturn(getAccountListDeferred.promise);


            var getFacilityListDeferred = $q.defer();
            getFacilityListDeferred.resolve([1, 2, 3]);

            spyOn(_accountListService, 'getFacilityList').andReturn(getFacilityListDeferred.promise);
            spyOn(httpCacheService, 'refreshTransactionalCache').andReturn(true);
            _accountListCtrl = $controller('accountListCtrl', {
                $scope: _scope,
                $rootScope: _rootScope,
                $http: _http,
                $timeout: _timeout,
                accountListService: _accountListService,
                errorService: _errorService,
                eventsService: _eventsService,
                notificationService: _notificationService,
                httpCacheService: httpCacheService
            });
            _scope.$parent.selectAccount = function() {
            };
            _scope.$parent.getSelectedAccountId = function() {
                return _scope.$parent.selectedAccountId;
            };
        });
    });

    it('should have initialize function', function() {
        expect(angular.isFunction(_scope.initialize)).toBe(true);
    });

    it('should have switchAccount function', function() {
        expect(angular.isFunction(_scope.switchAccount)).toBe(true);
    });

    it('should have saveNickname function', function() {
        expect(angular.isFunction(_scope.saveNickname)).toBe(true);
    });

    it('should perform switchAccount correctly', function() {
        _scope.accounts = [
            {
                id: 1,
                name: 'apple'
            },
            {
                id: 2,
                name: 'banana'
            }
        ];
        spyOn(_scope.$parent, 'selectAccount');
        spyOn(_scope, 'cancelNickname');
        _scope.switchAccount(0);
        expect(_scope.selectedAccount).toBe(_scope.accounts[0]);
        expect(_scope.selectedAccount.index).toBe(0);
        expect(_scope.$parent.selectAccount).toHaveBeenCalled();
        expect(_scope.cancelNickname).toHaveBeenCalled();
        expect(_scope.state.edit).toBeFalsy();
    });

    it('startedit should set new nickname to current one', inject(function($timeout) {
        _scope.startEdit('123');
        expect(_scope.state.edit).toBeTruthy();
        $timeout.flush();
    }));

    it('cancelNickname should set new nickname to current one', function() {
        _scope.initialize();
        _scope.selectedAccount = {
            newNickname: 'new nickname',
            nickname: 'old nickname',
            id: '1223'
        };
        _scope.cancelNickname();
        expect(_scope.selectedAccount.newNickname).toBe('old nickname');
        expect(_scope.stateEdit).toBeFalsy();
    });

    it('should perform saveNickname correctly', inject(function($q) {

        var saveNicknameDeferred = $q.defer();
        saveNicknameDeferred.resolve(true);
        spyOn(_accountListService, 'saveNickname').andReturn(saveNicknameDeferred.promise);
        spyOn(_accountListService, 'deleteNickname').andReturn(saveNicknameDeferred.promise);
        spyOn(_eventsService, 'publish').andCallThrough();

        _scope.selectedAccount = {
            newNickname: 'new nickname',
            nickname: 'old nickname',
            accountNumber: 'XXXX XXXX XXXX 1234',
            id: '1',
            productName: 'product name',
            nameNickname: 'old nickname'
        };

        _scope.selectedAccountId = '2';
        _scope.selectedAccount.index = 0;
        _scope.saveNickname();
        _scope.$apply();

        expect(_scope.selectedAccount.nickname).toBe('new nickname');
        expect(_scope.accounts[0].nickname).toBe('new nickname');
        expect(_scope.accounts[0].nameNickname).toBe('new nickname');
        expect(_scope.state.edit).toBe(false);

        expect(_eventsService.publish).toHaveBeenCalledWith('ACCOUNTLIST.ACCOUNT.SELECTED', _scope.accounts[0]);
        expect(_eventsService.publish).toHaveBeenCalledWith('ACCOUNTLIST.ACCOUNTS.LOADED', _scope.accounts);

        // update nickname to blank string, will default to productname
        _scope.selectedAccount.newNickname = '';
        _scope.saveNickname();
        _scope.$apply();
        expect(_scope.accounts[0].nameNickname).toBe('product name');
        expect(_scope.accounts[0].nickname).toBe('');

    }));

    it('saveNickname should skip saving nickname when nickname not changed', function() {
        var account = {
            id: '123',
            nickname: 'nickname'
        };
        spyOn(_accountListService, 'saveNickname').andCallThrough();
        _scope.saveNickname(account, 'nickname');
        expect(_accountListService.saveNickname).not.toHaveBeenCalled();
    });

    it('saveNickname should call delete nickname service when nickname is non blank', inject(function($q) {
        var rejectError = [{
                code: 'service',
                message: 'nickname error'
            }];
        var deleteNicknameDeferred = $q.defer();
        deleteNicknameDeferred.reject(rejectError);

        spyOn(_accountListService, 'deleteNickname').andReturn(deleteNicknameDeferred.promise);
        _scope.selectedAccount = {
            newNickname: '',
            nickname: 'old nickname',
            id: '1223'
        };
        _scope.saveNickname();
        _rootScope.$apply();
        expect(_scope.state.nicknameError).toBe(rejectError[0].message);
    }));


    it('saveNickname should call _notificationService.addAlert when a promise resolves with boolean false', inject(function($q) {
        var rejectError = [{
                code: 'service',
                message: 'nickname error'
            }];
        var deleteNicknameDeferred = $q.defer();
        deleteNicknameDeferred.reject(rejectError);

        spyOn(_accountListService, 'deleteNickname').andReturn(deleteNicknameDeferred.promise);
        _scope.selectedAccount = {
            newNickname: '',
            nickname: 'old nickname',
            id: '1223'
        };
        _scope.saveNickname();
        _rootScope.$apply();

        expect(_scope.state.nicknameError).toBe(rejectError[0].message);
    }));

    it('saveNickname should call deleteNickname when newNickname is empty ', inject(function($q) {
        var deleteNicknameDeferred = $q.defer();
        deleteNicknameDeferred.resolve(true);
        spyOn(_accountListService, 'deleteNickname').andReturn(deleteNicknameDeferred.promise);

        _scope.selectedAccount = {
            nickname: 'old nickname',
            newNickname: '',
            id: '1223',
            accountNumber: '456'
        };
        _scope.saveNickname();
        expect(_accountListService.deleteNickname).toHaveBeenCalledWith('1223', '456');
    }));

    it('should handle server errors when retrieving accountList', inject(function($q) {
        var accountListDeferred = $q.defer();
        accountListDeferred.reject([{code: 'test', message: 'testmessage'}]);

        _accountListService.getAccountList.andReturn(accountListDeferred.promise);
        _scope.initialize();
        _scope.$apply();

        expect(_errorService.setError).toHaveBeenCalledWith({code: 'test', message: 'testmessage'});
    }));

    it('getDisplayBalance should return correct balance', function() {
        var account = {
            accountType: 'mortgage',
            offsetAccount: false,
            balance: 12.00
        };

        // Negative balance for non-offset mortgage accounts
        account.accountType = "mortgage";
        account.offsetAccount = true;
        expect(_scope.getDisplayBalance(account)).toBe(-12);

        account.accountType = "card";
        account.offsetAccount = true;
        expect(_scope.getDisplayBalance(account)).toBe(-12);

        account.accountType = "core";
        account.balance = 12;
        expect(_scope.getDisplayBalance(account)).toBe(12);
    });

    it('account list should be refreshed after a payment is made', inject(function($q, $timeout) {
        var data=[];
        spyOn(_eventsService, 'publish').andCallThrough();
        _eventsService.publish('PAYMENT.IMMEDIATE.CREATED', data);

         _scope.$apply();
        expect(_accountListService.getAccountList).toHaveBeenCalled();
         _scope.$apply();
        expect(_eventsService.publish).toHaveBeenCalled();

        var accountListDeferred = $q.defer();
        accountListDeferred.reject([{code: 'test', message: 'testmessage'}]);
        _accountListService.getAccountList.andReturn(accountListDeferred.promise);
         _scope.$apply();

        _eventsService.publish('PAYMENT.IMMEDIATE.CREATED', data);
         _scope.$apply();
        $timeout.flush();
        expect(_errorService.setError).toHaveBeenCalled();

    }));



    it('should show/hide available balance section', function() {
        var account = {
            accountType : 'card'
        };

        expect(_scope.showAvailableBalanceSection (account)).toBeTruthy();

        account = {
            accountType : 'savings'
        };

        expect(_scope.showAvailableBalanceSection (account)).toBeTruthy();

        account = {
            accountType : 'transaction'
        };

        expect(_scope.showAvailableBalanceSection (account)).toBeTruthy();

        account = {
            accountType : 'mortgage',
            offsetAccount: true
        };

        expect(_scope.showAvailableBalanceSection (account)).toBeTruthy();

        account = {
            accountType : 'mortgage',
            permissions: {
                canRedraw: true
            }
        };

        expect(_scope.showAvailableBalanceSection (account)).toBeTruthy();

        account = {
            accountType : 'mortgage',
            offsetAccount: false,
            permissions: {
                canRedraw: false
            }
        };

        expect(_scope.showAvailableBalanceSection (account)).toBeFalsy();
    });

    it('should display correct available balance', function () {
        var account = {
            accountType: 'transaction',
            availBalance: -120.00
        };

        expect(_scope.showAccountBalance(account)).toBe(0);

        var account = {
            accountType: 'transaction',
            availBalance: 120.00
        };

        expect(_scope.showAccountBalance(account)).toBe(120);

        var account = {
            accountType: 'savings',
            availBalance: -120.00
        };

        expect(_scope.showAccountBalance(account)).toBe(-120);

        var account = {
            accountType: 'mortgage',
            availBalance: -120.00
        };

        expect(_scope.showAccountBalance(account)).toBe(-120);

        var account = {
            accountType: 'card',
            availBalance: -120.00
        };

        expect(_scope.showAccountBalance(account)).toBe(-120);
    });

    it('should return true if there is card account in the list', function () {
        _scope.accounts = [
            {
                accountType: 'mortgage'
            },{
                accountType: 'card'
            }
        ];

        expect(_scope.hasCards()).toBeTruthy();

        _scope.accounts = [
            {
                accountType: 'card'
            },{
                accountType: 'mortgage'
            }
        ];

        expect(_scope.hasCards()).toBeTruthy();
    });

    it('should return false if there is no card and mortgage account in the list', function () {
        _scope.accounts = [
            {
                accountType: 'savings'
            },{
                accountType: 'savings'
            }
        ];

        expect(_scope.hasMortgageAccounts ()).toBeFalsy();
        expect(_scope.hasCards()).toBeFalsy();

        _scope.accounts = [
            {
                accountType: 'transaction'
            },{
                accountType: 'transaction'
            }
        ];

        expect(_scope.hasMortgageAccounts ()).toBeFalsy();
        expect(_scope.hasCards()).toBeFalsy();
    });

    it('should return true if there is mortgage account in the list', function () {
        _scope.accounts = [
            {
                accountType: 'mortgage'
            },{
                accountType: 'card'
            }
        ];

        expect(_scope.hasMortgageAccounts ()).toBeTruthy();

        _scope.accounts = [
            {
                accountType: 'card'
            },{
                accountType: 'mortgage'
            }
        ];

        expect(_scope.hasMortgageAccounts ()).toBeTruthy();
    });

    it('should determine if account has mortgage accounts',function() {
        _scope.accounts = [];
        _scope.accounts.push({
            id:124,
            accountType:'cards'
        });
        _scope.accounts.push({
            id:123,
            accountType:'mortgage'
        });
        expect(_scope.hasMortgageAccounts()).toBeTruthy();
    });

    it('should determine if account has card accounts',function() {
        _scope.accounts = [];
        _scope.accounts.push({
            id:124,
            accountType:'mortgage'
        });
        _scope.accounts.push({
            id:123,
            accountType:'card'
        });
        expect(_scope.hasCards()).toBeTruthy();
    });

    it('should showTransactions should show transaction panel',function() {
        _scope.$parent.isPanelActive = function() {
            return false;
        };
         spyOn(_scope.$parent, 'isPanelActive').andReturn(false);
         _scope.$parent.hideAllPanel = function() {
            return true;
        };
        spyOn(_scope.$parent, 'hideAllPanel');
         _scope.$parent.showPanel = function() {
            return true;
        };
        spyOn(_scope.$parent, 'showPanel');
        _scope.showTransactions();
        expect(_scope.$parent.hideAllPanel).toHaveBeenCalled();
        expect(_scope.$parent.showPanel).toHaveBeenCalledWith('transactions');
    });

    it('should showAccountInfo should show account info panel',function() {
        _scope.$parent.hideToggleMenus = function() {
            return true;
        };
        spyOn(_scope.$parent, 'hideToggleMenus').andReturn(false);
        
        _scope.$parent.togglePanel = function() {
            return true;
        };
        spyOn(_scope.$parent, 'togglePanel');
 
        _scope.showAccountInfo();
        expect(_scope.$parent.hideToggleMenus).toHaveBeenCalled();
        expect(_scope.$parent.togglePanel).toHaveBeenCalledWith('accountInfo');
    });


});