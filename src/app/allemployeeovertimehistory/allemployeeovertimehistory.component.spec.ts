import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeOvertimeHistoryComponent } from './allemployeeovertimehistory.component';

describe('AllEmployeeOvertimeHistoryComponent', () => {
  let component: AllEmployeeOvertimeHistoryComponent;
  let fixture: ComponentFixture<AllEmployeeOvertimeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeOvertimeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeOvertimeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
