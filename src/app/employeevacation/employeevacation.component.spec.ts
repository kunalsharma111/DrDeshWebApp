import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVacationComponent } from './employeevacation.component';

describe('EmployeeVacationComponent', () => {
  let component: EmployeeVacationComponent;
  let fixture: ComponentFixture<EmployeeVacationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeVacationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeVacationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
