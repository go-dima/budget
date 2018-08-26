import { ITransaction } from "./ITransaction";
import { IAccountCheckbox } from "./IAccountCheckbox";
import { TransactiosService } from "./transactions.service";
import { Component, OnInit } from "@angular/core";
import * as _ from 'lodash';
import { IcuPlaceholder } from "@angular/compiler/src/i18n/i18n_ast";

@Component({
  selector: 'pm-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  pageTitle: string = "Transactions List";
  transactions: ITransaction[];
  filteredTransactions: ITransaction[];
  accounts: IAccountCheckbox[];
  errorMessage: string;

  _listFilter: string;
  get listFilter(): string {
      return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.filteredTransactions = this.listFilter ? this.performFilter(this.listFilter) : this.transactions;
  }

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    console.log("TransactiosService OnInit!");
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.transactions = transactions,
            this.filteredTransactions = this.transactions;
            this.accounts = _.uniqBy(this.transactions, 'account').map(this.transactionToAccount);
        },
        error => this.errorMessage = <any>error
    );
  }

  transactionToAccount(transaction: ITransaction): IAccountCheckbox {
      return { name: transaction.account, isChecked: true };
  }

  performFilter(filterBy: string): ITransaction[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.transactions.filter((transaction: ITransaction) =>
            transaction.category.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
}
