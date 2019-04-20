import { Component, OnInit } from '@angular/core';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'pm-accounts-filter',
  templateUrl: './accounts-filter.component.html',
  styleUrls: ['./accounts-filter.component.css']
})
export class AccountsFilterComponent implements OnInit {

  constructor(private _accountsService: AccountsService) { }

  ngOnInit() {
  }

  selectedAccountsChanged(selectedAccounts: string[]) {
    this._accountsService.selectedAccounts = selectedAccounts;
  }
}
  