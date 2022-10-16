import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateLimitComponent } from './date-limit.component';

describe('DateLimitComponent', () => {
  let component: DateLimitComponent;
  let fixture: ComponentFixture<DateLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
