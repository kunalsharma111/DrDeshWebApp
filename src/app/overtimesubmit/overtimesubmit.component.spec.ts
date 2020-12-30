import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeSubmitComponent } from './overtimesubmit.component';

describe('OvertimeSubmitComponent', () => {
  let component: OvertimeSubmitComponent;
  let fixture: ComponentFixture<OvertimeSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
