import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { User } from '../models/user.model';
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})

export class UsersService {  
  user: User = new User();
  users: any[] = [];
  userEmail: string = "";
  userDataExists: boolean = false;

  constructor(public db: AngularFirestore) {

   }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  createUser(user: any) { 
    let createdUser = this.db.collection('users').doc(user.uid).set((Object.assign({}, user)));
    console.log("Create user service: ", createdUser);

    return this.db.collection('users').doc(user.uid).set((Object.assign({}, user)));
  }

  getUserProfile(userId: string): Observable<any> {
    let userRef = firebase.firestore().collection('users');
    var authUser = firebase.auth().currentUser;

    return new Observable((observer) => {
      userRef.doc(userId).get().then((doc) => {
        let data = doc.data();         
        console.log("Get user profile observer: ", data);
        observer.next({
          uid: doc.id,
          name: _.isUndefined(data) || _.isUndefined(data.name) ? "" : data.name,
          surname: _.isUndefined(data) ? "" : data.surname,
          email: _.isUndefined(data) ? "" :  data.email,
          emailVerified: _.isUndefined(data) ? "" : data.emailVerified,
          cellphone: _.isUndefined(data) ? "" : data.cellphone,
          image: _.isUndefined(data) ? "" : data.image,
          referenceNumber: _.isUndefined(data) ? "" : data.referenceNumber,
          passportNumber: _.isUndefined(data) ? "" : data.passport,
          idNumber: _.isUndefined(data) ? "" : data.idnumber,
          bank: _.isUndefined(data) ? "" : data.bank,
          investmentReturns: _.isUndefined(data) ? "" : data.investmentReturns,
          amountInvested: _.isUndefined(data) ? "" : data.amountInvested,
          interestRate: _.isUndefined(data) ? "" : data.interestRate,
          transactions: _.isUndefined(data) ? "" : data.transactions,
          newEstimateId: _.isUndefined(data) ? "" : data.newEstimateId,
        });    
    });
  });
  }  
  
  updateUserProfile(userId: string, value: any): Promise<void>{
    return this.db.collection<User>('users').doc(userId).set(value);
  }

  updateUserEstimate(userId: string, newEstimateId: string): Promise<void>{
    return this.db.collection<User>('users').doc(userId).update({ "newEstimateId": newEstimateId });
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  getUsers(){    
    return this.db.collection('users').snapshotChanges();
  }
}
