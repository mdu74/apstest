import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
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
