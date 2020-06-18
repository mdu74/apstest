import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-our-contacts',
  templateUrl: './our-contacts.component.html',
  styleUrls: ['./our-contacts.component.css']
})
export class OurContactsComponent implements OnInit {

  user: User = new User();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })
  }

}
