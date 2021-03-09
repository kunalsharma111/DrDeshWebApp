import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesubmitComponent } from './invoicesubmit.component';

describe('InvoicesubmitComponent', () => {
  let component: InvoicesubmitComponent;
  let fixture: ComponentFixture<InvoicesubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
