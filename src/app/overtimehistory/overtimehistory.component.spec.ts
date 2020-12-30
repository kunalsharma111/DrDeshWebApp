import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeOvertimeHistoryComponent } from './overtimehistory.component';

describe('EmployeeOvertimeHistoryComponent', () => {
  let component: EmployeeOvertimeHistoryComponent;
  let fixture: ComponentFixture<EmployeeOvertimeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeOvertimeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeOvertimeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
