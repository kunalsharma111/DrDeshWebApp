import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFacilityApprovalComponent } from './employeefacilityapproval.component';

describe('EmployeeFacilityApprovalComponent', () => {
  let component: EmployeeFacilityApprovalComponent;
  let fixture: ComponentFixture<EmployeeFacilityApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeFacilityApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFacilityApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
