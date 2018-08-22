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
}
