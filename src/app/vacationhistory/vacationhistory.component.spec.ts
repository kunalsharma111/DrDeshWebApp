import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVacationHistoryComponent } from './vacationhistory.component';

describe('EmployeeVacationHistoryComponent', () => {
  let component: EmployeeVacationHistoryComponent;
  let fixture: ComponentFixture<EmployeeVacationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeVacationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeVacationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
