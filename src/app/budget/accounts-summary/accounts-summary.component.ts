import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';
import { uniqBy, orderBy } from 'lodash';
import Common from '../common';
import DateUtils from '../date-utils';
import { ITransaction } from '../ITransaction';
import { ICheckbox } from '../ICheckbox';

@Component({
  selector: 'pm-accounts-summary',
  templateUrl: './accounts-summary.component.html',
  styleUrls: ['./accounts-summary.component.css']
})
export class AccountsSummaryComponent implements OnInit {
  transactions: ITransaction[];
  accounts: ICheckbox[];
  data: any[] = [];

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit(): void {
    this._transactionsService.getAllTransactions().subscribe(
      transactions => {
          this.clear();
          this.transactions = orderBy(transactions, DateUtils.customDateKey, 'desc');
          this.accounts = uniqBy(this.transactions, 'account').map(Common.transactionToAccount);
          let totals: ITransaction = {
            account: "Total",
            balance: 0,
            date: "01/01/1900",
            amount: 0,
            category: "",
            comments: "",
            description: "",
            reference: 0
          };
          this.accounts.forEach(account => {
            let item = this.transactions.filter((t: ITransaction) => t.account == account.name)[0];
            this.data.push(item)
            totals.balance += item.balance;
            totals.date = DateUtils.max(totals.date, item.date);
          });
          this.data.unshift(totals)
      });
  }

  clear() {
    this.accounts = []
    this.data = []
  }
}
