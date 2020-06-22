import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { AngularFireList } from '@angular/fire/database';
import { User } from '../../models/user.model';
import * as _ from 'lodash';
import * as firebase from 'firebase';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  users: any;
  user: User;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {   
    console.log("Get all users");
    
    var authUser = firebase.auth().currentUser;
    console.log("Auth User: ", authUser);
    
    this.usersService.getUsers().subscribe(result => {
      this.users = result.map(r =>{
        return {
          uid: r.payload.doc.id,
          name: r.payload.doc.data()['name'],
          surname: r.payload.doc.data()['surname'],
          email: !_.isEmpty(r.payload.doc.data()['email']) ? r.payload.doc.data()['email'] : "Needs to add email address",
          emailVerified: r.payload.doc.data()['emailVerified'],
          cellphone: r.payload.doc.data()['cellphone'],
          bank: !_.isEmpty(r.payload.doc.data()['bank']) ? r.payload.doc.data()['bank'] : "Cannot detect bank name",
          creationTime: r.payload.doc.data()['creationTime'],
          lastSignInTime: r.payload.doc.data()['lastSignInTime'],
          idNumber: r.payload.doc.data()['idNumber'],
          transactions: r.payload.doc.data()['transactions']
        };
      });
      console.log(this.users[0].uid);
      console.log(this.users[0].name);
      console.log(this.users[0].surname);
    });
    // console.log(this.usersService.getUsers());
  }

}
