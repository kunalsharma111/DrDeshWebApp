import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureSubmitComponent } from './lecturesubmit.component';

describe('LectureSubmitComponent', () => {
  let component: LectureSubmitComponent;
  let fixture: ComponentFixture<LectureSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectureSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
