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
        
        if (!_.isUndefined(data)) {
          observer.next({
            uid: doc.id,
            name: data.name,
            surname: data.surname,
            email: authUser.email,
            emailVerified: _.isEmpty(data.emailVerified) || _.isUndefined(data.emailVerified) ? authUser.emailVerified : data.emailVerified,
            cellphone: data.cellphone,
            image: _.isEmpty(data.image) || _.isUndefined(data.image) ? authUser.photoURL : data.image,
            referenceNumber: data.referenceNumber,
            passportNumber: data.passport,
            idNumber: data.idnumber,
            bank: data.bank,
            investmentReturns: data.investmentReturns,
            amountInvested: data.amountInvested,
            interestRate: data.interestRate,
            transactions: data.transactions,
            newEstimateId: data.newEstimateId
          });
        }
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

  // getUserProfile(userId: string): Observable<User> {
  //   const usersDocuments = this.db.doc<User>('users/' + userId);
  //   return usersDocuments.snapshotChanges()
  //     .pipe(
  //       map(changes => {
  //         const data = changes.payload.data();
  //         const id = changes.payload.id;
  //         return { id, ...data };
  //       }))
  // }

  // getUserProfiles(userId: string): Observable<User[]> {
  //   const usersDocuments = this.db.collection<User[]>('users');
  //   return usersDocuments.snapshotChanges()
  //     .pipe(
  //       map(changes => changes.map(({ payload: { doc } }) => {
  //         const data = doc.data();
  //         const id = doc.id
  //         return { id, ...data };
  //       })),
  //       map((users) => users.find(doc => doc.id === userId)))
  // }

  // getUser(userId: string){
  //   return this.db.collection('users').doc(userId).snapshotChanges();
  // }

  // updateUser(userId: string, value: any){
  //   value.nameToSearch = value.name.toLowerCase();
  //   return this.db.collection('users').doc(userId).set(value);
  // }

  // deleteUser(userId: string){
  //   return this.db.collection('users').doc(userId).delete();
  // }  

  getUsers(){    
    return this.db.collection('users').snapshotChanges();
  }

  // createUser(user: any){
  //   return this.db.collection('users').add({
  //     name: user.name,
  //     surname: user.surname
  //   });
  // }
}
