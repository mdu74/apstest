import { Roles } from './roles.model';

export class FirebaseUser {
    uid: string;
    image: string;
    name: string;
    provider: string;
    email: string;
    emailVerified: false;
    cellphone: string;
    creationTime: Date;
    lastSignInTime: Date;
    roles : Roles;

    constructor() {
        this.uid = "";
        this.image = "";
        this.name = "";
        this.provider = "";
        this.email = "";
        this.emailVerified = false;
        this.cellphone = "";
        this.creationTime = new Date();
        this.lastSignInTime = new Date();
    }
}
