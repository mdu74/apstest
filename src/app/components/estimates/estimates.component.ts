import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { EstimatesService } from '../../service/estimates.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { Estimate } from '../../models/estimate.model';
import { Options } from 'ng5-slider';
import * as _ from "lodash";
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.css']
})

export class EstimatesComponent implements OnInit {
  date = moment();
  user: User = new User();
  getUser: User = new User();
  estimate: Estimate = new Estimate();
  estimates: Estimate[] = [];
  dashboardForm: FormGroup;
  profilePercentage: string;
  estimateId: string;
  investmentDays: number;

  investmentAmount: number = 250000;
  investmentAmountOptions: Options = {
    floor: 1500,
    step: 100,
    ceil: 500000,
    translate: function (value) {
      return "R" + value;
    },
  };

  maturityItem: number;
  maturityItemOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 30 },
      { value: 60 },
      { value: 90 }
    ]
  };

  constructor(public usersService: UsersService, private route: ActivatedRoute, private router: Router, private estimatesService: EstimatesService) {

    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      this.getUser = data;
      this.profilePercentage = "0%";
      this.investmentDays = 30;
    });    

  }

  ngOnInit() {
  }

  calculateImvestmentReturns(): number {
    if (this.profilePercentage == "25%") {
      return (this.investmentAmount / 4) + this.investmentAmount;
    } else if (this.profilePercentage == "50%") {
      return (this.investmentAmount / 2) + this.investmentAmount;
    } else if (this.profilePercentage == "100%") {
      return this.investmentAmount + this.investmentAmount;
    } else {
      return 0;
    }
  }

  saveEstimate(): void {
    this.estimate.estimateId = "";
    this.estimate.investmentReturns = this.calculateImvestmentReturns();
    this.estimate.amountInvested = this.investmentAmount;
    this.estimate.interestRate = this.profilePercentage;
    this.estimate.expiryDate = moment().add(7, 'days').format("YYYY-MM-DD");
    let event = moment(this.estimate.expiryDate);
    let currentDate = moment().format("YYYY-MM-DD");
    this.estimate.createdOn = moment().format("DD-MM-YYYY HH:mm:ss");    
    this.estimate.expiresIn =  event.diff(currentDate, "days");

    var docData = {      
      estimateId: this.estimate.estimateId,
      investmentReturns: this.estimate.investmentReturns,
      amountInvested: this.estimate.amountInvested,
      interestRate: this.estimate.interestRate,
      createdOn: this.estimate.createdOn,
      expiryDate: this.estimate.expiryDate,
      expiresIn: this.estimate.expiresIn,
      userId: this.getUser.uid
    };

    this.estimatesService.createEstimate(docData)
        .then((result)=>{
          let estimateId = result.id
          this.usersService.updateUserEstimate(this.getUser.uid, estimateId);
          this.estimatesService.updateEstimate(estimateId);

          Swal.fire({
            type: 'success',
            title: 'Your estimate has been saved',
            showConfirmButton: false,
            timer: 2000
          }).then(()=> this.router.navigate(['/dashboard']));
        });
  }

  getInterestRates(): string {
    let percentage = "0%";

    if (this.investmentDays === 30) {
      percentage = "25%";
    } else if (this.investmentDays === 60) {
      percentage = "50%";
    } else if (this.investmentDays === 90) {
      percentage = "100%";
    }

    this.profilePercentage = percentage;
    return percentage;
  }
}
