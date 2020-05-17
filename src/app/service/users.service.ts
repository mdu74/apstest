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

  constructor(public db: AngularFirestore, private afs: AngularFireDatabase) { }

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
          newEstimateId: _.isUndefined(data) ? "" : data.newEstimateId
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
