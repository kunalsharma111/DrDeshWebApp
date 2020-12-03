import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSubmitComponent } from './receiptsubmit.component';

describe('ReceiptSubmitComponent', () => {
  let component: ReceiptSubmitComponent;
  let fixture: ComponentFixture<ReceiptSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
