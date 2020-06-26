import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { EstimatesService } from '../../service/estimates.service';
import { User } from '../../models/user.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import { Estimate } from '../../models/estimate.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  user: User = new User();
  userId: string = "";
  estimate: Estimate;
  estimates: Estimate[] = [];
  pendingEstimates: Estimate[] = [];
  approvedEstimates: Estimate[] = [];
  paidStatus: {[key: string]: boolean}
  estimateDetailsForm: FormGroup;
  editEstimateForm: FormGroup;

  constructor(private usersService: UsersService, private estimatesService: EstimatesService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.paidStatus = {
      "Approved" : true, 
      "Pending" : false, 
    };      

    this.createEstimateDetailsForm();
    this.route.params.subscribe( params => this.userId = params.uid );
    
    this.usersService.getUserProfile(this.userId).subscribe(result => { 
      this.user = result;
    });

    this.getEstimatesByUser(this.userId);

    _.forEach((estimate: Estimate)=>{
      if (estimate.paidFor) {        
        this.pendingEstimates.push(estimate);
      } else {
        this.approvedEstimates.push(estimate);
      }
    });
  }

  getEstimatesByUser(userId: string){  
    this.estimatesService.getEstimatesByUser(userId).onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((estimateDoc)=>{
        let data = estimateDoc.data();
        let estimate = new Estimate;
        
        estimate.estimateId =  _.isEmpty(estimateDoc.id) || _.isUndefined(estimateDoc.id) ? this.user.newEstimateId : estimateDoc.id;
        estimate.amountInvested = _.isUndefined(data.amountInvested) || _.isNull(data.amountInvested) ? 0 : data.amountInvested;
        estimate.interestRate = _.isUndefined(data.interestRate) || _.isNull(data.interestRate) ? 0 : data.interestRate;
        estimate.investmentReturns = _.isUndefined(data.investmentReturns) || _.isNull(data.investmentReturns) ? 0 : data.investmentReturns;
        estimate.createdOn = data.createdOn;
        estimate.expiryDate = data.expiryDate;
        estimate.expiresIn = this.getRemainingDays(data.expiryDate);
        estimate.userId = data.userId;
        estimate.paidFor = data.paidFor;
        this.estimates.push(estimate);
        console.log(this.estimates)
      });
    });
  }

  getRemainingDays(expiresIn: any): number{ 
    let event = moment(expiresIn);
    let currentDate = moment().format("YYYY-MM-DD");  
    return  event.diff(currentDate, "days");
  }

  deleteEstimate(estimateId: string){
    this.estimatesService.deleteEstimate(estimateId);
    this.estimates.length = 0;
  }

  updateEstimate(estimate: any){
    debugger;
    console.log("Update estimate: ", estimate);
  }
 
  createEstimateDetailsForm() {
    this.estimateDetailsForm = new FormGroup({
      expiresIn: new FormControl(''),
      paidFor: new FormControl(''),
    });
  }

  estimateSelected(estimateId: string){
    this.estimatesService.getEstimateById(estimateId).subscribe((querySnapshot)=>{
      let data = querySnapshot.data();
      let estimate = new Estimate;      
      estimate.estimateId =  _.isEmpty(estimateId) || _.isUndefined(estimateId) ? this.user.newEstimateId : estimateId;
      estimate.amountInvested = _.isUndefined(data.amountInvested) || _.isNull(data.amountInvested) ? 0 : data.amountInvested;
      estimate.interestRate = _.isUndefined(data.interestRate) || _.isNull(data.interestRate) ? 0 : data.interestRate;
      estimate.investmentReturns = _.isUndefined(data.investmentReturns) || _.isNull(data.investmentReturns) ? 0 : data.investmentReturns;
      estimate.createdOn = data.createdOn;
      estimate.expiryDate = data.expiryDate;
      estimate.expiresIn = this.getRemainingDays(data.expiryDate);
      estimate.userId = data.userId;
      estimate.paidFor = data.paidFor;
      this.estimate = estimate;
      console.log("real estimate is: ",this.estimate);
    
      this.editEstimateForm = this.formBuilder.group({ 
        expiresIn : [this.estimate.expiresIn],
        paidFor: [this.estimate.paidFor]
      });
      console.log("outside estimate is: ", this.editEstimateForm);
    });
  }
}
