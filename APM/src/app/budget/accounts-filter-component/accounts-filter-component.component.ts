import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IAccountCheckbox } from '../IAccountCheckbox';
import { TransactiosService } from '../transactions.service';
import { ITransaction } from '../ITransaction';
import * as _ from 'lodash';

@Component({
  selector: 'pm-accounts-filter-component',
  templateUrl: './accounts-filter-component.component.html',
  styleUrls: ['./accounts-filter-component.component.css']
})
export class AccountsFilterComponentComponent{
  accounts: IAccountCheckbox[];
  @Output() accountsSelected: EventEmitter<string[]> = new EventEmitter<string[]>();
  errorMessage: string;

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.accounts = _.uniqBy(transactions, 'account').map(this.transactionToAccount);
        },
        error => this.errorMessage = <any>error
    );
  }

  transactionToAccount(transaction: ITransaction): IAccountCheckbox {
    return { name: transaction.account, isChecked: true };
  }
  
  selectedAccountsChanged(event: any) {
    let displayedAccounts = this.accounts.filter((account: IAccountCheckbox) => account.isChecked)
                                          .map(account => account.name);
    this.accountsSelected.emit(displayedAccounts);
  }
}
