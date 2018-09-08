import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ICheckbox } from '../ICheckbox';
import { TransactiosService } from '../transactions.service';
import { ITransaction } from '../ITransaction';
import * as _ from 'lodash';

@Component({
  selector: 'pm-accounts-filter',
  templateUrl: './accounts-filter.component.html',
  styleUrls: ['./accounts-filter.component.css']
})
export class AccountsFilterComponent{
  accounts: ICheckbox[];
  @Output() accountsSelected: EventEmitter<string[]> = new EventEmitter<string[]>();
  errorMessage: string;

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.accounts = _.uniqBy(transactions, 'account').map(this.transactionToAccount);
            this.selectedAccountsChanged(null);
        },
        error => this.errorMessage = <any>error
    );
  }

  transactionToAccount(transaction: ITransaction): ICheckbox {
    return { name: transaction.account, isChecked: true };
  }
  
  selectedAccountsChanged(event: any) {
    let displayedAccounts = this.accounts.filter((account: ICheckbox) => account.isChecked)
                                          .map(account => account.name);
    this.accountsSelected.emit(displayedAccounts);
  }
}
