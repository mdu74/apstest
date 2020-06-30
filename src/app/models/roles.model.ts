export class Roles { 
    master?: boolean;
    admin?: boolean;
    client?: boolean;

    constructor(){
        this.client = true;
        this.admin = false;
        this.master = false;
    }
 }

 