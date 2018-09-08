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
  selectedAccounts: string[];
  selectedCategories: string[];
  report: IReportEntry[] = [];
  errorMessage: any;
  groupByProperties: string[] = ["date", "category"];
  groupByProperty: string = "date";
  sortBy: string = 'key';
  sortOrder: number = 1;
  orderOptions: string[] = ['asc', 'desc'];
  
  constructor(private _transactionsService: TransactiosService) { }
  
  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => { this.accountGroups = _.groupBy(transactions, 'account'); },
      error => this.errorMessage = <any>error
    );
  }
  
  selectedAccountsChanged(selectedAccounts: string[]) {
    this.selectedAccounts = selectedAccounts;
    this.generateReport();
  }
 
  selectedCategoriesChanged(selectedCategories: string[]) {
    this.selectedCategories = selectedCategories;
    this.generateReport();
  }

  private generateReport() {
    let self = this;
    self.report = [];
    _.forEach(_.keys(this.accountGroups), function (key) {
      if (self.selectedAccounts.includes(key)) {
        let filteredTransactions = self.filterCategories(self.accountGroups[key], self.selectedCategories);
        let monthlyGroups = _.groupBy(filteredTransactions,
                                      function(t: ITransaction) { return self.extractKey(t, self.groupByProperty); });
        _.forEach(monthlyGroups, function (monthReport: ITransaction[], monthKey: string) {
          _.forEach(monthReport, function (t: ITransaction) {
            self.addOrUpdate(self.report, monthKey, t.amount);
          });
        });
      }
    });
    self.report = _.values(self.report);
    self.reorderReport(this.sortBy);
  }

  private filterCategories(toFilter: ITransaction[], selectedCategories: string[]): ArrayLike<ITransaction> {
    if (!selectedCategories)
      return toFilter;

    let filtered = toFilter.filter(function(t: ITransaction) {
      return selectedCategories.includes(t.category);
    });
    return filtered;
  }
  
  extractKey(t: ITransaction, groupBy: string): string {
    if (groupBy == "date") 
      return t.date.substring(3);
    else
      return t.category;
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

  reorderReport(sortBy: string): any {
    this.sortBy = sortBy;
    this.sortOrder = 1 - this.sortOrder;
    this.report = _.orderBy(this.report, this.sortBy, this.orderOptions[this.sortOrder]);
  }
}
