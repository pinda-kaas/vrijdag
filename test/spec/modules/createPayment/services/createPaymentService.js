'use strict';

describe('createPaymentService', function () {
    var createPaymentService, httpBackend;

    beforeEach(module('PersonalBanking'));


    beforeEach(inject(function (_createPaymentService_, $httpBackend) {
        createPaymentService = _createPaymentService_;
        httpBackend = $httpBackend;
    }));

    it('should have function getPaymentLeavingDate', function () {
        expect(angular.isFunction(createPaymentService.getPaymentLeavingDate)).toBe(true);
    });

    it('should have function getPaymentLeavingDate', function () {
        expect(angular.isFunction(createPaymentService.getPaymentLeavingDate)).toBe(true);
    });

    it('should have function getPaymentType', function () {
        expect(angular.isFunction(createPaymentService.getPaymentType)).toBe(true);
    });
});


describe('createPaymentService : getPaymentType', function () {
    var createPaymentService, httpBackend;

    beforeEach(module('PersonalBanking'));


    beforeEach(inject(function (_createPaymentService_, $httpBackend) {
        createPaymentService = _createPaymentService_;
        httpBackend = $httpBackend;
    }));

    it('should return null when fromAccount and toAccount are null', function () {
        var fromAccount = null;
        var toAccount = null;
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe(null);
    });

    it('should return "funds_transfer" when toAccount.type === payee', function () {
        var fromAccount = {
            anything: 'anything'
        };
        var toAccount = {
            type: 'payee'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('funds_transfer');
    });

    it('should return "bpay" when toAccount.type === biller', function () {
        var fromAccount = {
            anything: 'anything'
        };
        var toAccount = {
            type: 'biller'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('bpay');
    });

    it('should return "funds_transfer" when toAccount.type === nominated', function () {
        var fromAccount = {
            anything: 'anything'
        };
        var toAccount = {
            type: 'nominated'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('funds_transfer');
    });


    it('should return "internal_transfer" when toAccount.type === internal and fromAccount._type is "core" and toAccount._type is "core"', function () {
        var fromAccount = {
            _type: 'core'
        };
        var toAccount = {
            type: 'internal',
            _type: 'core'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('internal_transfer');
    });

    it('should return "internal_transfer" when toAccount.type === internal and fromAccount._type is "core" and toAccount._type is "credit_card"', function () {
        var fromAccount = {
            _type: 'core'
        };
        var toAccount = {
            type: 'internal',
            _type: 'anything',
            accountType: 'credit_card'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('internal_transfer');
    });

    it('should return "internal_transfer" when toAccount.type === internal and fromAccount._type is "core" and toAccount._type is "mortgage"', function () {
        var fromAccount = {
            _type: 'core'
        };
        var toAccount = {
            type: 'internal',
            _type: 'mortgage'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('funds_transfer');
    });

    it('should return "internal_transfer" when toAccount.type === internal and fromAccount._type is "core" and toAccount._type is "cash"', function () {
        var fromAccount = {
            _type: 'core'
        };
        var toAccount = {
            type: 'internal',
            _type: 'cash'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('funds_transfer');
    });

    it('should return "bpay" when toAccount.type === internal and fromAccount.accountType === "mortgage" and toAccount.accountType === "credit_card"', function () {
        var fromAccount = {
            accountType: 'mortgage',
            _type: 'anything'
        };
        var toAccount = {
            type: 'internal',
            _type: 'anything',
            accountType: 'credit_card'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('bpay');
    });

    it('should return "funds_transfer" when toAccount.type === internal and fromAccount.accountType === "mortgage" and toAccount.accountType is anything', function () {
        var fromAccount = {
            _type: 'anything',
            accountType: 'mortgage'
        };
        var toAccount = {
            type: 'internal',
            accountType: 'anything'
        };
        expect(createPaymentService.getPaymentType(fromAccount, toAccount)).toBe('funds_transfer');
    });
});

describe('createPaymentService : getPaymentLeavingDate', function () {
    var createPaymentService, httpBackend;

    beforeEach(module('PersonalBanking'));


    beforeEach(inject(function (_createPaymentService_, $httpBackend) {
        createPaymentService = _createPaymentService_;
        httpBackend = $httpBackend;
    }));

    it('should return null paymentObj.startDate when fromAccount is null and toAccount is null', function () {
        var now = moment();
        var paymentObj = {
            startDate: now,
            fromAccount : null,
            toAccount : null
        };
        expect(createPaymentService.getPaymentLeavingDate(paymentObj, now)).toBe(now);
    });

    it('should return null paymentObj.startDate when it is an internal core to core payment', function () {
        var now = moment();
        var paymentObj = {
            startDate: now,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'core',
                type: 'internal'
            }
        };
        expect(createPaymentService.getPaymentLeavingDate(paymentObj, now)).toBe(now);
    });

    it('should be next business day Monday if paymentObj.startDate is a Saturday', function () {
        var now = moment();
        var saturday = moment('2015-06-27 16:00:00.000+10:00');
        var followingMonday = moment('2015-06-29 16:00:00.000+10:00');
        var paymentObj = {
            startDate: saturday,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal'
            }
        };
        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, now)).isSame(followingMonday, 'day')).toBe(true);
    });

    it('should be next business day Monday if paymentObj.startDate is a Sunday', function () {
        var now = moment();
        var saturday = moment('2015-06-28 16:00:00.000+10:00');
        var followingMonday = moment('2015-06-29 16:00:00.000+10:00');
        var paymentObj = {
            startDate: saturday,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal'
            }
        };
        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, now)).isSame(followingMonday, 'day')).toBe(true);
    });

    it('should be same business day for bpay payment before cutoff time', function () {
        var weekDayBeforeBpayCutoff = moment('2015-06-30 16:00:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'biller'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(weekDayBeforeBpayCutoff, 'day')).toBe(true);
    });

    it('should be next business day for bpay payment before cutoff time when payment.startDate is a public holiday', function () {
        var weekDayBeforeBpayCutoff = moment('2017-01-26 16:00:00.000+10:00');
        var nextBusinessDay = moment('2017-01-27 16:00:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'biller'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(nextBusinessDay, 'day')).toBe(true);
    });

    it('should be same business day for bpay payment before cutoff time when payment.startDate is a public holiday', function () {
        var weekDayBeforeBpayCutoff = moment('2016-01-26 17:01:00.000+10:00');
        var nextBusinessDay = moment('2016-01-27 17:01:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'biller'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(nextBusinessDay, 'day')).toBe(true);
    });

    it('should be next business day for bpay payment after cutoff time', function () {
        var weekDayAfterBpayCutoff = moment('2015-06-30 17:01:00.000+10:00');
        var followingDay = moment('2015-07-01 +10:00');

        var paymentObj = {
            startDate: weekDayAfterBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'biller'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayAfterBpayCutoff)).isSame(followingDay, 'day')).toBe(true);
    });

    it('should be same business day for core to credit card payment before cutoff time', function () {
        var weekDayBeforeBpayCutoff = moment('2015-06-30 16:00:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'credit_card'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(weekDayBeforeBpayCutoff, 'day')).toBe(true);
    });

    it('should be next business day for core to credit card payment before cutoff time when payment.startDate is a public holiday', function () {
        var weekDayBeforeBpayCutoff = moment('2016-01-26 16:00:00.000+10:00');
        var nextBusinessDay = moment('2016-01-27 16:00:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'credit_card'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(nextBusinessDay, 'day')).toBe(true);
    });

    it('should be next business day for core to credit card payment after cutoff time', function () {
        var weekDayAfterBpayCutoff = moment('2015-06-30 17:01:00.000+10:00');
        var followingDay = moment('2015-07-01 +10:00');

        var paymentObj = {
            startDate: weekDayAfterBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'credit_card'
            }
        };

        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayAfterBpayCutoff)).isSame(followingDay, 'day')).toBe(true);
    });

    it('should be same business day for funds_transfer before cutoff time', function () {
        var weekDayBeforeBpayCutoff = moment('2015-06-30 15:29:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'mortgage'

            }
        };
        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(weekDayBeforeBpayCutoff, 'day')).toBe(true);
    });

    it('should be next business day for funds_transfer after cutoff time', function () {
        var weekDayBeforeBpayCutoff = moment('2015-06-30 15:31:00.000+10:00');
        var followingDay = moment('2015-07-01 15:31:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'mortgage'

            }
        };
        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(followingDay, 'day')).toBe(true);
    });

    it('should be next business day for funds_transfer before cutoff time if payment.startDate is on public holiday', function () {
        var weekDayBeforeBpayCutoff = moment('2015-12-24 15:29:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'mortgage'

            }
        };
        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(weekDayBeforeBpayCutoff, 'day')).toBe(true);
    });

    it('should be next business day for funds_transfer after cutoff time if payment.startDate is on public holiday', function () {
        var weekDayBeforeBpayCutoff = moment('2015-12-24 15:31:00.000+10:00');
        var nextBusiness = moment('2015-12-29 15:31:00.000+10:00');

        var paymentObj = {
            startDate: weekDayBeforeBpayCutoff,
            fromAccount : {
                _type : 'core',
            },
            toAccount : {
                _type: 'credit_card',
                type: 'internal',
                accountType : 'mortgage'

            }
        };
        expect(moment(createPaymentService.getPaymentLeavingDate(paymentObj, weekDayBeforeBpayCutoff)).isSame(nextBusiness, 'day')).toBe(true);
    });
});

describe('createPaymentService : getPaymentArrivingDate', function () {
    var createPaymentService, httpBackend;

    beforeEach(module('PersonalBanking'));


    beforeEach(inject(function (_createPaymentService_, $httpBackend) {
        createPaymentService = _createPaymentService_;
        httpBackend = $httpBackend;
    }));

    it('should return null when fromAccount is null and toAccount is null', function () {
        var weekDay = moment('2015-06-30 12:01:00.000+10:00');

        var paymentObj = {
            paymentType: null,
            fromAccount : null,
            toAccount : null
        };
        expect(createPaymentService.getPaymentArrivingDate(paymentObj, weekDay)).toBe(null);
    });

    it('should return same day as moneyLeavingDate for bpay on working day', function () {
        var moneyLeavingDateOnWorkDay = moment('2015-06-30 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'biller'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWorkDay)).isSame(moneyLeavingDateOnWorkDay, 'day')).toBe(true);
    });

    it('should return same as moneyLeavingDate for bpay on public holiday', function () {
        var moneyLeavingDateOnPublicHoliday = moment('2016-01-26 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'biller'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnPublicHoliday)).isSame(moneyLeavingDateOnPublicHoliday, 'day')).toBe(true);
    });

    it('should return same as moneyLeavingDate for bpay on weekend', function () {
        var moneyLeavingDateOnWeekend = moment('2016-01-30 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'biller'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWeekend)).isSame(moneyLeavingDateOnWeekend, 'day')).toBe(true);
    });

    it('should return same day as moneyLeavingDate for internal_transfer on working day', function () {
        var moneyLeavingDateOnWorkDay = moment('2015-06-30 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                _type: 'core'
            },
            toAccount : {
                type: 'internal',
                _type: 'core'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWorkDay)).isSame(moneyLeavingDateOnWorkDay, 'day')).toBe(true);
    });

    it('should return same as moneyLeavingDate for internal_transfer on public holiday', function () {
        var moneyLeavingDateOnPublicHoliday = moment('2016-01-26 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                _type: 'core'
            },
            toAccount : {
                type: 'internal',
                _type: 'core'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnPublicHoliday)).isSame(moneyLeavingDateOnPublicHoliday, 'day')).toBe(true);
    });

    it('should return same as moneyLeavingDate for internal_transfer on weekend', function () {
        var moneyLeavingDateOnWeekend = moment('2016-01-30 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                _type: 'core'
            },
            toAccount : {
                type: 'internal',
                _type: 'core'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWeekend)).isSame(moneyLeavingDateOnWeekend, 'day')).toBe(true);
    });

    it('should return next business day after moneyLeavingDate for funds transfer on working day', function () {
        var moneyLeavingDateOnWorkDay = moment('2015-06-30 15:31:00.000+10:00');
        var nextWorkDay = moment('2015-07-01 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'payee'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWorkDay)).isSame(nextWorkDay, 'day')).toBe(true);
    });

    it('should return next business day after moneyLeavingDate for funds transfer on public day', function () {
        var moneyLeavingDateOnPublicHoliday = moment('2016-01-26 15:31:00.000+10:00');
        var nextWorkDay = moment('2016-01-27 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'payee'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnPublicHoliday)).isSame(nextWorkDay, 'day')).toBe(true);
    });

    it('should return 2nd business day after moneyLeavingDate for funds transfer on weekend', function () {
        var moneyLeavingDateOnWeekend = moment('2016-01-30 15:31:00.000+10:00');
        var nextWorkDay = moment('2016-02-01 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'payee'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWeekend)).isSame(nextWorkDay, 'day')).toBe(true);
    });

    it('should return same day as moneyLeavingDate for core to core payment even on weekends', function () {
        var moneyLeavingDateOnWeekend = moment('2016-01-30 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything',
                _type: 'core'
            },
            toAccount : {
                type: 'internal',
                _type: 'core'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnWeekend)).isSame(moneyLeavingDateOnWeekend, 'day')).toBe(true);
    });

    it('should return same day as moneyLeavingDate for core to core payment even on public holidays', function () {
        var moneyLeavingDateOnPublicHoliday = moment('2016-01-26 15:31:00.000+10:00');

        var paymentObj = {
            fromAccount : {
                anything: 'anything'
            },
            toAccount : {
                type: 'biller'
            }
        };
        expect(moment(createPaymentService.getPaymentArrivingDate(paymentObj, moneyLeavingDateOnPublicHoliday)).isSame(moneyLeavingDateOnPublicHoliday, 'day')).toBe(true);
    });

});







