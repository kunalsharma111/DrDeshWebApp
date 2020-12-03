import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeReceiptHistoryComponent } from './allemployeereceipthistory.component';

describe('AllEmployeeReceiptHistoryComponent', () => {
  let component: AllEmployeeReceiptHistoryComponent;
  let fixture: ComponentFixture<AllEmployeeReceiptHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeReceiptHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeReceiptHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
