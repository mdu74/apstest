import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Estimate } from '../models/estimate.model';

@Injectable({
  providedIn: 'root'
})

export class EstimatesService {
  estimate: Estimate = new Estimate();

  constructor(public db: AngularFirestore) { }

  getEstimatesByUser(userId: string) {
    return firebase.firestore().collection("estimates").where("userId", "==", userId);
  }

  getAllEstimates(): AngularFirestoreCollection<Estimate>{
    let estimates = this.db.collection<Estimate>("estimates");
    return estimates;
  }
  
  createEstimate(estimate: any) { 
    return this.db.collection("estimates").add(estimate);
  }

  deleteEstimate(estimateId: string){
    this.db.collection("estimates").doc(estimateId).delete();
  }

  updateEstimate(estimateId: string){
    return this.db.collection<Estimate>('estimates').doc(estimateId).update({ "estimateId": estimateId });
  }
}
