import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';
import { uniqBy, orderBy } from 'lodash';
import Common from '../common';
import DateUtils from '../date-utils';
import { ITransaction } from '../ITransaction';
import { IAccountSummary } from '../IAccountSummary';

@Component({
  selector: 'pm-accounts-summary',
  templateUrl: './accounts-summary.component.html',
  styleUrls: ['./accounts-summary.component.css']
})
export class AccountsSummaryComponent implements OnInit {
  transactions: ITransaction[];
  accounts: IAccountSummary[];
  byAccount: { [key: string] : ITransaction[]} = {};

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit(): void {
    this._transactionsService.getAllTransactions().subscribe(
      transactions => {
          this.clear();
          let orderedTransactions = orderBy(transactions, Common.transactionDateKey, 'desc');
          this.accounts = uniqBy(orderedTransactions, 'account').map(this.accountSummary);
          this.accounts.forEach(account => {
            this.byAccount[account.name] = orderedTransactions.filter((t: ITransaction) => t.account == account.name);
            let latestTransaction = this.byAccount[account.name][0]
            
            const incomeFilter = (t: ITransaction) => t.amount > 0;
            const expenseFilter = (t: ITransaction) => t.amount < 0;

            account.balance = latestTransaction.balance
            account.date = latestTransaction.date
            account.income_average = this.calcAverage(this.byAccount[account.name], incomeFilter);
            account.expense_average = this.calcAverage(this.byAccount[account.name], expenseFilter);
            account.net_average = account.income_average + account.expense_average;
          });
          
          let totals: IAccountSummary = {
            name: "Total",
            balance:  Common.accumulate(this.accounts.map(a => a.balance)),
            date: this.accounts.map(a => a.date).reduce((a, b) => DateUtils.max(a, b)),
            income_average: Common.accumulate(this.accounts.map(a => a.income_average)),
            expense_average: Common.accumulate(this.accounts.map(a => a.expense_average)),
            net_average: Common.accumulate(this.accounts.map(a => a.net_average))
          };
          this.accounts.unshift(totals);
      });
  }

  private calcAverage(sourceTransactions: ITransaction[], customFilter: (t: ITransaction) => boolean): number {
    const yearBack: string = this.yearBack(sourceTransactions[0].date);
    const latestTranasactions: ITransaction[] = sourceTransactions.filter((t: ITransaction) => DateUtils.isBigger(t.date, yearBack))
    const filteredAmounts: number[] = latestTranasactions.filter(customFilter).map((t: ITransaction) => t.amount);
    const filteredSum = filteredAmounts.length > 0 ? Common.accumulate(filteredAmounts) : 0;
    const filteredAvg = filteredSum / 12 || 0;
    return filteredAvg;
  }

  accountSummary(transaction: ITransaction): IAccountSummary {
    return {
      name: transaction.account,
      balance: 0,
      income_average : 0,
      expense_average : 0,
      net_average: 0,
      date: "01/01/1900"
    }
  }

  clear() {
    this.accounts = []
  }

  yearBack(date: string) : string {
    let year = Number(date.slice(-4))
    let yearBack = date.slice(0, -4) + (year - 1).toString()
    return yearBack;
  }
}
