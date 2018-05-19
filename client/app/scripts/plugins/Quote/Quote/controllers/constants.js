angular.module('getlancerApp.Quote.Constant', [])
    .constant('ConstQuoteStatuses', {
        'New': 1,
        'UnderDiscussion': 2,
        'Hired': 3,
        'Completed': 4,
        'NotInterested': 5,
        'Closed': 6,
        'NotCompleted': 7
    })
    .constant('ConstBidStatuses', {
        'Pending': 1,
        'Won': 2,
        'Lost': 3
    })
    .constant('ConstQuoteTypes', {
        'FlatRate': 1,
        'HourlyRate': 2,
        'MoreInformationRequired': 3
    })
    .constant('ConstUserRole', {
        'Admin': 1,
        'User': 2,
        'Employer': 3,
        'Freelancer': 4
    })
    .constant('ConstDiscountType', {
        'Percentage': 1,
        'Amount': 2
    })
    .constant('ConstPayToEscrow', {
        'Paid': 1,
        'NotPaid': 0
    })
    .constant('ConstPaymentGateways', {
        'Wallet': 1,
        'ZazPay': 2,
        'PayPal': 3
    })
    .constant('ConstServiceType', {
        'RentalAndSales': 1,
        'Rental': 2,
        'Sales': 3
    })
    .constant('ConstType', {
        'Open': 0,
        'Archived': 1
    })
    .constant('ConstTransactionType', {
        'AmountAddedToWallet': 1,
        'AdminAddedAmountToUserWallet': 2,
        'AdminDeductedAmountToUserWallet': 3,
        'ProjectListingFee': 4,
        'AmountMovedToEscrow': 5,
        'ProjectMilestonePayment': 6,
        'ContestListingFee': 7,
        'AmountRefundedToWalletForCanceledContest': 8,
        'AmountRefundedToWalletForRejectedContest': 9,
        'ContestFeaturesUpdatedFee': 10,
        'ContestTimeExtendedFee': 11,
        'AmountMovedToParticipant': 12,
        'JobListingFee': 13,
        'ServiceListingFee': 14,
        'QuoteSubscriptionPlan': 15,
        'ProjectEmployerCommision': 16,
        'ProjectFreelancerCommision': 17,
        'RefundOnWithdrawFreelancer': 18,
        'CancelEscrow': 19,
    });