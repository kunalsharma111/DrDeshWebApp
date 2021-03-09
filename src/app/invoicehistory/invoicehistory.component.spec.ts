import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicehistoryComponent } from './invoicehistory.component';

describe('InvoicehistoryComponent', () => {
  let component: InvoicehistoryComponent;
  let fixture: ComponentFixture<InvoicehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
