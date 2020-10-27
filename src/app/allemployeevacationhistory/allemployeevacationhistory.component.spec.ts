import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeVacationHistoryComponent } from './allemployeevacationhistory.component';

describe('AllEmployeeVacationHistoryComponent', () => {
  let component: AllEmployeeVacationHistoryComponent;
  let fixture: ComponentFixture<AllEmployeeVacationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeVacationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeVacationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
