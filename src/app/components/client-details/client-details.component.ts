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
  updatedEstimates: Estimate[] = [];
  pendingEstimates: Estimate[] = [];
  approvedEstimates: Estimate[] = [];
  paidStatus: {[key: string]: boolean}
  estimateDetailsForm: FormGroup;
  editEstimateForm: FormGroup;

  constructor(private usersService: UsersService, private estimatesService: EstimatesService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.createEstimateDetailsForm();
    this.route.params.subscribe( params => this.userId = params.uid );
    
    this.usersService.getUserProfile(this.userId).subscribe(result => { 
      this.user = result;
    });

    this.getEstimatesByUser(this.userId);

  
  }

  getEstimatesByUser(userId: string){  

    this.estimatesService.getEstimatesByUser(userId).onSnapshot((querySnapshot)=>{
      this.estimates.length = 0;
      this.approvedEstimates.length = 0;
      this.pendingEstimates.length = 0;
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
      this.estimates.forEach((estimate: Estimate)=>{
        if (estimate.paidFor) {  
          this.approvedEstimates.push(estimate);               
        } else {
          this.pendingEstimates.push(estimate);
        }
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
    let oldExpiresIn = this.estimate.expiresIn;
    let newExpiresIn = estimate.expiresIn;
    this.estimate.expiryDate = moment(this.estimate.expiryDate).add(newExpiresIn - oldExpiresIn, 'days').format("YYYY-MM-DD");
    this.estimate.paidFor = estimate.paidFor;
    this.estimate.expiresIn = estimate.expiresIn;
    this.updatedEstimates.push(this.estimate)
    console.log("added estimate is: ",this.estimate);
    console.log("updated list of estimates: ",this.updatedEstimates); 
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
      this.editEstimateForm = this.formBuilder.group({ 
        expiresIn : [this.estimate.expiresIn],
        paidFor: [this.estimate.paidFor]
      });
    });
  }

  updateAllEstimates(){
    this.updatedEstimates.forEach(estimate => this.estimatesService.updateEstimateDetails(estimate.estimateId, estimate));
    this.updatedEstimates.length = 0;
  }
}
