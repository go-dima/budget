import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';
import { ITransaction } from '../ITransaction';
import { Dictionary } from 'lodash';
import * as _ from 'lodash';
import { IReportEntry } from '../IReportEntry';

@Component({
  selector: 'pm-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.css']
})
export class BalanceReportComponent implements OnInit {
  accountGroups: Dictionary<ITransaction[]>;
  errorMessage: any;
  report: IReportEntry[] = [];

  constructor(private _transactionsService: TransactiosService) { }

  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => { this.accountGroups = _.groupBy(transactions, 'account'); },
      error => this.errorMessage = <any>error
    );
  }

  selectedAccountsChanged(selectedAccounts: string[]) {
    let self = this;
    self.report = [];
    _.forEach(_.keys(this.accountGroups), function(key)   {
      if (selectedAccounts.includes(key)) {
        let monthlyGroups = _.groupBy(self.accountGroups[key], self.extractKey);
        _.forEach(monthlyGroups, function(monthReport: ITransaction[], monthKey: string) {
          _.forEach(monthReport, function(t: ITransaction) {
            self.addOrUpdate(self.report, monthKey, t.amount);
          });
        });
      }
    });
    self.report = _.values(self.report);
  }

  extractKey(t: ITransaction): string { 
    return t.date.substring(3);
    // return t.category;
  }

  addOrUpdate(report: IReportEntry[], key: string, value: number) {
    if (!_.has(report, key)) {
      report[key] = { key: key, income: 0, expense: 0, balance: 0};
    }

    if (value > 0) {
      report[key].income += value;
    }
    else {
      report[key].expense += value; 
    }

    report[key].balance += value;
  }
}
