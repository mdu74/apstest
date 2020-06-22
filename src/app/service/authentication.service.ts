import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { UsersService } from '../service/users.service';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService{
  user: User = new User;
  user$: Observable<User>;
  constructor(public afAuth: AngularFireAuth, public router: Router, private userService: UsersService, private db: AngularFirestore) { }

  doFacebookAuth(agreedToTerms: boolean) {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.createUserIfItDoesNotExist(result, agreedToTerms);
        resolve(result);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doGoogleAuth(agreedToTerms: boolean){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        this.createUserIfItDoesNotExist(result, agreedToTerms);
        resolve(result);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doRegister(value){
    return new Promise<any>((resolve, reject)=>{
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(result => {
          this.createUserIfItDoesNotExist(result, value.agreedToTerms);
          this.sendVerificationMail();
          resolve(result);
        }, err => {
          reject(err);
        })
    })
  }

  sendVerificationMail(){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.sendEmailVerification().then(() => {
        this.router.navigate(['/dashboard']);
      });
    });
  }

  isLoggedIn(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => {
        reject(err)
      })
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut().then(() => {
          localStorage.clear();
          window.location.reload();
          this.router.navigate(['/signIn']);
        });
        resolve();
      }
      else {
        reject();
      }
    });
  }

  forgotPassword(email: string) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email)
      .then(res => {
        window.alert('Password reset email sent, check your inbox.');
        resolve(res);
      }, err => {
        window.alert("Password hasn't been reset");
        reject(err);
      })
    })
  }

  createUserIfItDoesNotExist(result: any, agreeToTerms: boolean) {
    const usersRef = this.db.collection('users').doc(result.user.uid);
    
    usersRef.ref.get()
      .then((docSnapshot) => {
        if (!docSnapshot.exists) {
          let user = this.setUserData(result);
          this.userService.createUser(user);
        }
      });
  }

  setUserData(res: any): any {
    let user = { uid: "", name: "", surname: "", email: "", cellphone: "", image: "", referenceNumber: "", agreedToTerms: false, roles: { client: true } };

    user.uid = res.user.uid;
    user.name = /\s/.test(res.user.displayName) ? res.user.displayName.split(" ")[0] : res.user.displayName;
    user.surname = /\s/.test(res.user.displayName) ? res.user.displayName.split(" ")[1] : "";
    user.email = res.user.email;
    user.cellphone = res.user.phoneNumber;
    user.image = res.user.photoURL;
    user.referenceNumber = this.generateReferenceNumber(user.email, res.user.providerData[0].providerId);
    user.agreedToTerms = res.user.agreedToTerms;
    return user;
  }

  generateReferenceNumber(email: string, providerType: string): string {
    let splitEmail = email.split("@");
    let referenceNumber = splitEmail[0].substring(0, 3).toUpperCase() + providerType.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 500).toString();

    return referenceNumber;
  }

  isAdmin(): Promise<boolean | void> {
    let isAdmin = false;
    return firebase.auth().currentUser.getIdTokenResult()
    .then(idTokenResult => {
      if (idTokenResult.claims.admin) {
        isAdmin = true;
        return isAdmin;
      }
      return isAdmin;
    })
    .catch((error) => {
      console.log(error);
    });
  }
}