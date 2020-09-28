import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFacilityComponent } from './employeefacility.component';

describe('EmployeeFacilityComponent', () => {
  let component: EmployeeFacilityComponent;
  let fixture: ComponentFixture<EmployeeFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
