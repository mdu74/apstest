export class Estimate {    
    estimateId: string;
    amountInvested: number;
    interestRate: string;
    investmentReturns: number;
    userId: string;
    createdOn: string;
    expiryDate: string;
    expiresIn: number;
    paidFor: boolean;

    constructor(){
        this.estimateId = "";
        this.amountInvested = 0;
        this.interestRate = "";
        this.investmentReturns = 0;
        this.userId = "";
        this.createdOn = "";
        this.expiryDate = "";
        this.expiresIn = 0;
        this.paidFor = false;
    }
}
