import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLectureHistoryComponent } from './lecturehistory.component';

describe('EmployeeLectureHistoryComponent', () => {
  let component: EmployeeLectureHistoryComponent;
  let fixture: ComponentFixture<EmployeeLectureHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeLectureHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLectureHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
