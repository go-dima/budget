import { ITransaction } from "../ITransaction";
import { ICheckbox } from "../ICheckbox";
import { TransactiosService } from "../transactions.service";
import { Component, OnInit } from "@angular/core";
import { uniqBy, map, orderBy } from 'lodash';

@Component({
  selector: 'pm-transactions',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css']
})
export class TransactionsComponent implements OnInit {
  pageTitle: string = "Transactions List";
  transactions: ITransaction[];
  filteredTransactions: ITransaction[];
  accounts: ICheckbox[];
  displayedAccounts: string[];
  errorMessage: string;

  _listFilter: string;
  get listFilter(): string {
      return this._listFilter;
  }
  set listFilter(value: string) {
      this._listFilter = value;
      this.performFilter(this.listFilter);
  }

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.transactions = transactions,
            this.filteredTransactions = this.transactions;
            this.accounts = uniqBy(this.transactions, 'account').map(this.transactionToAccount);
        },
        error => this.errorMessage = <any>error
    );
  }

  transactionToAccount(transaction: ITransaction): ICheckbox {
      return { name: transaction.account, isChecked: true };
  }

  performFilter(filterBy: string) {
      let byAccount = this.transactions.filter((transaction: ITransaction) =>
                        this.displayedAccounts.includes(transaction.account));

      this.filteredTransactions = orderBy(this.listFilter ? this.applyCaregoryFilter(byAccount, filterBy) : byAccount, 'date');
    }
    
  applyCaregoryFilter(toFilter: ITransaction[], filterBy: string): ITransaction[] {
    filterBy = filterBy.toLocaleLowerCase();
    return toFilter.filter((transaction: ITransaction) =>
            transaction.category.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  selectedAccountsChanged(selectedAccounts: string[]) {
    this.displayedAccounts = selectedAccounts;
    this.performFilter(this.listFilter);
  }
}
