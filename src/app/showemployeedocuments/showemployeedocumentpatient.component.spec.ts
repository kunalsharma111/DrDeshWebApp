import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployeeDocuemntComponent } from './showemployeedocumentpatient.component';

describe('ShowEmployeeDocuemntComponent', () => {
  let component: ShowEmployeeDocuemntComponent;
  let fixture: ComponentFixture<ShowEmployeeDocuemntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowEmployeeDocuemntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmployeeDocuemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
