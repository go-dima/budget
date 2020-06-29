import { ITransaction } from "../ITransaction";
import { ICheckbox } from "../ICheckbox";
import { TransactiosService } from "../transactions.service";
import { Component, OnInit } from "@angular/core";
import { uniqBy, orderBy } from 'lodash';
import { AccountsService } from "../accounts-filter/accounts.service";
import DateUtils from "../date-utils";
import Common from "../common";

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
  selectedCategories: string[];

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
    this._transactionsService.getAllTransactions().subscribe(
      transactions => {
            this.transactions = transactions;
            this.filteredTransactions = this.transactions;
            this.accounts = uniqBy(this.transactions, 'account').map(Common.transactionToAccount);
            this.selectedAccountsChanged();
        },
        error => this.errorMessage = error
    );
    this._accountsService.accountsChanged.subscribe(() => this.selectedAccountsChanged());
  }

  performFilter(filterBy: string) {
      if (this.transactions == undefined || this.displayedAccounts == undefined)
        return;
      const byAccount = this.transactions
                            .filter((transaction: ITransaction) => this.displayedAccounts.includes(transaction.account));
      const byCategory = this.selectedCategories
                             ? byAccount.filter((transaction: ITransaction) => this.selectedCategories.includes(transaction.category))
                             : byAccount
      this.filteredTransactions = orderBy(this.listFilter ? this.applyCaregoryFilter(byCategory, filterBy) : byCategory, Common.transactionSortKey, 'desc');
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

  selectedCategoriesChanged(selectedCategories: string[]) {
    this.selectedCategories = selectedCategories
    this.performFilter(this.listFilter)
  }
}
