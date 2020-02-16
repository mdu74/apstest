import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurContactsComponent } from './our-contacts.component';

describe('OurContactsComponent', () => {
  let component: OurContactsComponent;
  let fixture: ComponentFixture<OurContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
