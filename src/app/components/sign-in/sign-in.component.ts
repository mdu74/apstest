import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import swal from 'sweetalert2'; 

import { ToastrService } from 'ngx-toastr';
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  displayForgotPasswordForm: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder) {
      this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }

  facebookLogin(agree: boolean){
    this.authenticationService.doFacebookAuth(agree)
    .then(res => {
      this.router.navigate(['/dashboard']);
    })
  }

  googleLogin(agree: boolean){
    this.authenticationService.doGoogleAuth(agree)
    .then(res => {
      this.router.navigate(['/dashboard']);
    })
  }

  tryLogin(value: any){
    this.authenticationService.doLogin(value)
    .then(res => {
      this.router.navigate(['/dashboard']);
    }, err => {
      swal.fire(err.code, err.message, 'error');
      this.errorMessage = err.message;
    })
  }

  forgotPassword(){
    this.displayForgotPasswordForm = this.displayForgotPasswordForm ? false : true;
  }

  resetPassword(email: string){
    this.authenticationService.forgotPassword(email)
    .then(res => {      
      swal.fire(res.code, res.message, 'success');
    }, err => {      
      swal.fire(err.code, err.message, 'error');
    });
  }

  ngOnInit() {
  }
}
