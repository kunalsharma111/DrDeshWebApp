import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReceiptHistoryComponent } from './receipthistory.component';

describe('EmployeeReceiptHistoryComponent', () => {
  let component: EmployeeReceiptHistoryComponent;
  let fixture: ComponentFixture<EmployeeReceiptHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReceiptHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReceiptHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
