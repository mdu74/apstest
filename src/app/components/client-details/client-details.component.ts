import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { EstimatesService } from '../../service/estimates.service';
import { User } from '../../models/user.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as firebase from 'firebase';
import { Estimate } from '../../models/estimate.model';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private usersService: UsersService, private estimatesService: EstimatesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => this.userId = params.uid );
    
    this.usersService.getUserProfile(this.userId).subscribe(result => { 
      this.user = result;
      console.log("Client details: ", this.user);
    });

    this.estimatesService.getEstimatesByUser(this.userId).onSnapshot((querySnapshot)=>{
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
        this.estimates.push(estimate);
      });
    });

    _.forEach((estimate: Estimate)=>{
      if (estimate.paidFor) {        
        this.pendingEstimates.push(estimate);
      } else {
        this.approvedEstimates.push(estimate);
      }
    });

    console.log("Pending Estimates: ", this.pendingEstimates);
    console.log("Approved Estimates: ", this.approvedEstimates);
    console.log("Estimates: ", this.estimates);
  }

  getRemainingDays(expiresIn: any): number{ 
    let event = moment(expiresIn);
    let currentDate = moment().format("YYYY-MM-DD");  
    return  event.diff(currentDate, "days");
  }

  deleteEstimate(estimateId: string){
    this.estimatesService.deleteEstimate(estimateId);
  }
}
