import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeInvoiceHistoryComponent } from './all-employee-invoice-history.component';

describe('AllEmployeeInvoiceHistoryComponent', () => {
  let component: AllEmployeeInvoiceHistoryComponent;
  let fixture: ComponentFixture<AllEmployeeInvoiceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeInvoiceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeInvoiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
