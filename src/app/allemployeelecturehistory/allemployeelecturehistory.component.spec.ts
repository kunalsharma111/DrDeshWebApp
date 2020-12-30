import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmployeeLectureHistoryComponent } from './allemployeelecturehistory.component';

describe('AllEmployeeLectureHistoryComponent', () => {
  let component: AllEmployeeLectureHistoryComponent;
  let fixture: ComponentFixture<AllEmployeeLectureHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEmployeeLectureHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmployeeLectureHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
