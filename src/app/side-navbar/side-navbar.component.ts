import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { UsersService } from '../service/users.service';
import { Router, ActivatedRoute, NavigationEnd  } from '@angular/router';
import Swal from 'sweetalert2';
import * as _ from "lodash";

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  isLoggedIn: boolean = true;
  canRegister: boolean = false;
  mySubscription: any;
  visible: boolean;
  
  constructor(public authenticationService: AuthenticationService, private router: Router, public usersService: UsersService) {
    this.usersService.getCurrentUser()
    .then((result)=>{
      this.isLoggedIn = true;
      this.canRegister = false;
    },(error)=>{
      this.isLoggedIn = false;
      this.canRegister = true;
    });       
    
    this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
      console.log("Test: ", this.router.navigate(['dashboard']));
      this.router.navigate(['side-navbar']);
    }); 

    // setTimeout(() => {
    //   let registerNavBar = document.getElementById("registerUser");
    //   if (!_.isNull(registerNavBar) && this.isLoggedIn) {
    //     console.log("Location reload happens here... ");
    //     location.reload();   
    //   }
    // }, 1000);
  }

  ngOnInit() {            
    this.usersService.getCurrentUser()
    .then((result)=>{
      this.isLoggedIn = true;
      this.authenticationService.isAdmin().then((value:boolean)=>{ this.visible = value });
      this.canRegister = false;
    },(error)=>{
      this.isLoggedIn = false;
      this.canRegister = true;
    });  
  }

  logout(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not have access to your dashboard or send an estimate while you are logged out!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result)=>{
      if (result.value === true) {
        this.authenticationService.doLogout()
        .then((res) => {
          this.router.navigate(['/home']);
        }, (error) => {
          console.log("Logout error", error);
        });        
      }      
    })
  }

}
