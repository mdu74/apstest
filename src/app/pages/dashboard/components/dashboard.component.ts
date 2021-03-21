import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../service/users.service';
import { EstimatesService } from '../../../service/estimates.service';
import { AuthenticationService } from '../../../service/authentication.service';
import { Router, ActivatedRoute , NavigationEnd} from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Estimate } from '../../../models/estimate.model';
import Swal from 'sweetalert2';
import * as _ from "lodash";
import * as moment from 'moment';
 
@Component({
  selector: 'aps-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  user: User = new User();
  getUser: User = new User();
  estimate: Estimate = new Estimate();
  estimates: Estimate[] = [];
  dashboardForm: FormGroup;
  profileMode = "display";
  isVerified: boolean;
  bankIsSelected: boolean = false;
  isPassport: boolean = true;
  isIdNumber: boolean = true;
  banks: any[] = [];
  bankName: string = "";
  bankClass: string = "";

  constructor(
    public usersService: UsersService,
    public estimatesService: EstimatesService,
    public authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {

    this.banks = [
      "Absa",
      "Capitec",
      "FNB",
      "Standard Bank",
      "Nedbank",
      "Tymebank"
    ];

    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      this.getUser = data;        
    });

    this.isVerified = this.getUser.emailVerified;    
    this.getBankClass();    
  }

  ngOnInit() {
    this.getUserProfile();

    this.dashboardForm = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl(''),
      idnumber: new FormControl(''),
      passport: new FormControl(''),
      cellphone: new FormControl(''),
      bank: new FormControl(''),
    });   
  }

  getBankClass(){
    if (this.user.bank === "Absa") {
      return "absa";
    } else if (this.user.bank === "Capitec") {
      return "capitec";
    } else if (this.user.bank === "FNB") {
      return "fnb";
    } else if (this.user.bank === "Standard Bank") {
      return "standard-bank";
    } else if (this.user.bank === "Nedbank") {
      return "nedbank";
    }
    else if (this.user.bank === "Tymebank") {
      return "tymebank";
    }
  }

  getUserProfile() {
    this.estimatesService.getEstimatesByUser(this.getUser.uid).onSnapshot((querySnapshot) => {
      querySnapshot.forEach((estimateDoc) => {
        let data = estimateDoc.data();
        let estimate = new Estimate;

        estimate.estimateId = _.isEmpty(estimateDoc.id) || _.isUndefined(estimateDoc.id) ? this.user.newEstimateId : estimateDoc.id;
        estimate.amountInvested = _.isUndefined(data.amountInvested) || _.isNull(data.amountInvested) ? 0 : data.amountInvested;
        estimate.interestRate = _.isUndefined(data.interestRate) || _.isNull(data.interestRate) ? 0 : data.interestRate;
        estimate.investmentReturns = _.isUndefined(data.investmentReturns) || _.isNull(data.investmentReturns) ? 0 : data.investmentReturns;
        estimate.createdOn = data.createdOn;
        estimate.expiryDate = data.expiryDate;
        estimate.expiresIn = this.getRemainingDays(data.expiryDate);
        estimate.userId = data.userId;
        this.estimates.push(estimate);
      });

      this.estimates.forEach((estimate) => {
        if (estimate.expiresIn < 0) {
          // this.estimatesService.deleteExpiredEstimate();
          this.estimatesService.deleteEstimate(estimate.estimateId);
          Swal.fire(
            'Your Estimate Has Expired!',
            `Your estimate of the amount ${estimate.amountInvested} for created on ${estimate.createdOn} has expired!`,
            'warning'
          );
        }
      });

    });

    this.setUserDataFromDatabase(this.getUser.uid);
  }

  setUserDataFromDatabase(userId: string): void {
    this.usersService.getUserProfile(userId).subscribe(data => {
      this.user.uid = data.uid;
      this.user.cellphone = data.cellphone;
      this.user.name = _.isEmpty(data.name) ? this.getName(this.getUser.name) : data.name;
      this.user.surname = _.isEmpty(data.surname) ? this.getSurname(this.getUser.surname) : data.surname;
      this.user.image = this.getUser.image;
      this.user.provider = this.getUser.provider;
      this.user.email = this.getUser.email;
      this.user.idNumber = data.idNumber;
      this.user.bank = this.validateBank(data.bank) ? data.bank : this.user.bank;
      this.user.passportNumber = data.passportNumber;
      this.user.emailVerified = this.getUser.emailVerified;
      this.user.referenceNumber = this.getUser.referenceNumber;
      this.user.newEstimateId = data.newEstimateId;
      this.user.transactions = this.countEstimates();
      this.user.estimates = data.estimates;

      if(this.user.idNumber.length > 3){
        this.isPassport = false;       
      }

      if(this.user.passportNumber.length > 3){
        this.isIdNumber = false;       
      }
      console.log("User profile: ", this.user);
      this.createForm(this.user);
      this.hasBankDetails(this.user);
    });
  }

  validateBank(bank: string): boolean {
    var result = _.isEmpty(bank) || (bank === "Absa" || bank === "Capitec" || bank === "FNB" || bank === "Standard Bank" || bank === "Nedbank" || bank === "Tymebank");
    return result;
  }

  hasBankDetails(user: User) {
    this.bankIsSelected = _.isEmpty(user.bank) || _.isUndefined(user.bank) ? false : true;
  }

  getRemainingDays(expiresIn: any): number {
    let event = moment(expiresIn);
    let currentDate = moment().format("YYYY-MM-DD");
    return event.diff(currentDate, "days");
  }

  getName(name: string): string {
    if (/\s/.test(name)) {
      let getName = name.split(" ")[0];
      return getName;
    } else {
      return name;
    }
  }

  getSurname(surname: string): string {
    if (_.isEmpty(surname) || _.isUndefined(surname) || _.isNull(surname)) {
      let getSurname = this.user.name.split(" ")[1];
      return getSurname;
    } else {
      return surname.indexOf(" ") > -1 ? surname.split[1] : surname;
    }
  }

  userHasCellphone(cellphone: string): boolean {
    return _.isEmpty(cellphone) || _.isNull(cellphone) ? false : true;
  }
  
  createForm(user: User) {
    this.dashboardForm = this.formBuilder.group({
      name: [this.getName(user.name), [ Validators.required, Validators.minLength(2), Validators.pattern('[A-Z][a-z ]*')]],
      surname: [this.getSurname(user.surname), [ Validators.required, Validators.minLength(2), Validators.pattern('[A-Z][a-z ]*')]],
      idnumber: [user.idNumber, Validators.required],
      image: user.image,
      provider: user.provider,
      bank: user.bank,
      email: user.email,
      emailVerified: user.emailVerified,
      passport: user.passportNumber,
      cellphone: [user.cellphone, Validators.required],
      transactions: user.transactions,
      referenceNumber: user.referenceNumber,
      estimates: user.estimates
    });
  }

  switchProfileMode() {

    if (this.profileMode == "display") {
      this.profileMode = "edit";
    } else {
      this.profileMode = "display";
    }
  }

  updateProfile(userdata: any) {
    userdata.email = this.user.email;
    userdata.uid = this.user.uid;
    userdata.image = this.user.image;
    userdata.provider = this.user.provider;
    userdata.roles = Object.assign({}, this.user.roles);
    userdata.referenceNumber = this.user.referenceNumber;

    this.usersService
      .updateUserProfile(this.user.uid, userdata)
      .then(() => {
        this.profileMode = "display";
        this.setUserDataFromDatabase(this.user.uid);
      });
   
    Swal.fire(
      'Thank You!',
      'You have updated your details!',
      'success'
    );
  }

  passportVisibility(event: any): void {
    if (event.target.value.length > 3) {
      this.isPassport = false;
    }
    else
    {
      this.isPassport = true;
      if(this.isPassport && event.target.value.length > 3){
        this.isIdNumber = false;
      }
    }
    const invalid = [];
    const controls = this.dashboardForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log("invalid control is ",invalid)
  }

  idNumberVisibility(event: any): void {
    if (event.target.value.length > 3) {
      this.isIdNumber = false;
    }
    else
    {
      this.isIdNumber = true;
      if(this.isIdNumber && event.target.value.length > 3){
        this.isPassport = false;
      }  
    }
  }


  goBackToDisplay(): void {
    this.profileMode = "display";
  }

  countEstimates(): number {
    return this.estimates.length;
  }

  getBank(name: string): void {
    this.bankName = name;
  }
}
