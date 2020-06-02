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
  orderedTransactions: ITransaction[];
  selectedCategories: string[];
  yearlyTransactions: ITransaction[];

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit(): void {
    this._transactionsService.getAllTransactions().subscribe(
      transactions => {
        this.clear();
        this.orderedTransactions = orderBy(transactions, Common.transactionDateKey, 'desc');
        const yearAgo: string = yearBack(this.orderedTransactions[0].date);
        this.yearlyTransactions = this.orderedTransactions.filter((t: ITransaction) => DateUtils.isBigger(t.date, yearAgo))

        this.accounts = uniqBy(this.orderedTransactions, 'account').map(accountSummary);
        let totals: IAccountSummary = newAccountSummary("Total");
        this.accounts.unshift(totals);
        this.reload();
      });
  }
  
  private reload() {
    this.accounts.forEach(account => {
      let relevantTransactions = this.selectedCategories ?
        this.yearlyTransactions.filter((t: ITransaction) => this.selectedCategories.includes(t.category)) :
        this.yearlyTransactions
      const latestTransaction = this.orderedTransactions.filter(t => t.account == account.name)[0]
      account.balance = latestTransaction ? latestTransaction.balance : 0;
      
      this.byAccount[account.name] = relevantTransactions.filter((t: ITransaction) => t.account == account.name);
      const latestYearlyTransaction = this.byAccount[account.name][0];
      account.date = latestYearlyTransaction? latestYearlyTransaction.date : "01/01/1900";

      const incomeFilter = (t: ITransaction) => t.amount > 0;
      const expenseFilter = (t: ITransaction) => t.amount < 0;
      account.balance = latestTransaction ? latestTransaction.balance : 0;
      account.date = latestTransaction? latestTransaction.date : "01/01/1900";
      account.income_average = this.calcAverage(this.byAccount[account.name], incomeFilter);
      account.expense_average = this.calcAverage(this.byAccount[account.name], expenseFilter);
      account.net_average = account.income_average + account.expense_average;
    });
    this.accounts[0].balance = Common.accumulate(this.accounts.map(a => a.balance))
    this.accounts[0].date = this.accounts.map(a => a.date).reduce((a, b) => DateUtils.max(a, b))
    this.accounts[0].income_average = Common.accumulate(this.accounts.map(a => a.income_average))
    this.accounts[0].expense_average = Common.accumulate(this.accounts.map(a => a.expense_average))
    this.accounts[0].net_average = Common.accumulate(this.accounts.map(a => a.net_average))
  }

  private calcAverage(sourceTransactions: ITransaction[], customFilter: (t: ITransaction) => boolean): number {
    if (!sourceTransactions || sourceTransactions.length == 0)
    return 0
    const yearAgo: string = yearBack(sourceTransactions[0].date);
    const latestTranasactions: ITransaction[] = sourceTransactions.filter((t: ITransaction) => DateUtils.isBigger(t.date, yearAgo))
    const filteredAmounts: number[] = latestTranasactions.filter(customFilter).map((t: ITransaction) => t.amount);
    const filteredSum = filteredAmounts.length > 0 ? Common.accumulate(filteredAmounts) : 0;
    const filteredAvg = filteredSum / 12 || 0;
    return filteredAvg;
  }
  
  clear() {
    this.accounts = []
  }
  
  selectedCategoriesChanged(selectedCategories: string[]) {
    this.selectedCategories = selectedCategories;
    this.reload()
  }
}

function newAccountSummary(newName: string): IAccountSummary {
  return {
    name: newName,
    balance: 0,
    date: "01/01/1900",
    income_average: 0,
    expense_average: 0,
    net_average: 0
  };
}

function accountSummary(transaction: ITransaction): IAccountSummary {
  return newAccountSummary(transaction.account)
}

function yearBack(date: string) : string {
  let year = Number(date.slice(-4))
  let yearBack = date.slice(0, -4) + (year - 1).toString()
  return yearBack;
}



