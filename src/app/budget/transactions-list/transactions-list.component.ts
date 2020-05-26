import { ITransaction } from "../ITransaction";
import { ICheckbox } from "../ICheckbox";
import { TransactiosService } from "../transactions.service";
import { Component, OnInit } from "@angular/core";
import { uniqBy, map, orderBy } from 'lodash';
import { AccountsService } from "../accounts-filter/accounts.service";

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

  constructor(private _transactionsService: TransactiosService,
              private _accountsService: AccountsService) { }

  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => {
            this.transactions = transactions;
            this.filteredTransactions = this.transactions;
            this.accounts = uniqBy(this.transactions, 'account').map(this.transactionToAccount);
            this.selectedAccountsChanged();
        },
        error => this.errorMessage = error
    );
    this._accountsService.accountsChanged.subscribe(() => this.selectedAccountsChanged());
  }

  transactionToAccount(transaction: ITransaction): ICheckbox {
      return { name: transaction.account, isChecked: true };
  }

  performFilter(filterBy: string) {
      if (this.transactions == undefined || this.displayedAccounts == undefined)
        return;
      let byAccount = this.transactions.filter((transaction: ITransaction) =>
                        this.displayedAccounts.includes(transaction.account));

      this.filteredTransactions = orderBy(this.listFilter ? this.applyCaregoryFilter(byAccount, filterBy) : byAccount, this.customDateKey, 'desc');
  }

  customDateKey(transaction: ITransaction): string {
    return transaction.date.substring(6) + transaction.date.substring(3,5) + transaction.date.substring(0,2);
  }
    
  applyCaregoryFilter(toFilter: ITransaction[], filterBy: string): ITransaction[] {
    filterBy = filterBy.toLocaleLowerCase();
    return toFilter.filter((transaction: ITransaction) =>
            transaction.category.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  selectedAccountsChanged() {
    this.displayedAccounts = this._accountsService.selectedAccounts;
    this.performFilter(this.listFilter);
  }
}
