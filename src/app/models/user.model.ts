import { Estimate } from './estimate.model';
import { Roles } from './roles.model';

export class User {
    uid: string;
    image: string;
    name: string;
    surname: string;
    provider: string;
    bank: string;
    email: string;
    emailVerified: false;
    cellphone: string;
    creationTime: Date;
    lastSignInTime: Date;
    idNumber: string;
    passportNumber: string;
    referenceNumber: string;
    transactions: number;
    newEstimateId: string;
    estimates: Estimate[];
    agreedToTerms: boolean;
    roles : Roles;

    constructor() {
        this.uid = "";
        this.image = "";
        this.name = "";
        this.surname = "";
        this.provider = "";
        this.bank = "";
        this.email = "";
        this.emailVerified = false;
        this.cellphone = "";
        this.creationTime = new Date();
        this.lastSignInTime = new Date();
        this.idNumber = "";
        this.passportNumber = "";
        this.referenceNumber = "";
        this.newEstimateId = "";
        this.transactions = 0;
        this.estimates = [];
        this.agreedToTerms = false;
        this.roles = new Roles();
    }
}
