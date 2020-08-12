import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttchFileComponent } from './attchfile.component';

describe('AttchFileComponent', () => {
  let component: AttchFileComponent;
  let fixture: ComponentFixture<AttchFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttchFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttchFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
