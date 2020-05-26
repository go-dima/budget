import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsFilterComponent } from './accounts-filter.component';

describe('AccountsFilterComponent', () => {
  let component: AccountsFilterComponent;
  let fixture: ComponentFixture<AccountsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
