import { ITransaction } from "./transaction";
import { TransactiosService } from "./transactions.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'pm-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  pageTitle: string = "Transactions List";
  transactions: ITransaction[];
  filteredTransactions: ITransaction[];
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
        },
        error => this.errorMessage = <any>error
    );
  }

  performFilter(filterBy: string): ITransaction[] {
      filterBy = filterBy.toLocaleLowerCase();
      return this.transactions.filter((transaction: ITransaction) =>
            transaction.account.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
}
