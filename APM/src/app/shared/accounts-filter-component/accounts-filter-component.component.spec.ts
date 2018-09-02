import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsFilterComponentComponent } from './accounts-filter-component.component';

describe('AccountsFilterComponentComponent', () => {
  let component: AccountsFilterComponentComponent;
  let fixture: ComponentFixture<AccountsFilterComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsFilterComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsFilterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
