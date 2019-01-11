import { Component, OnInit } from '@angular/core';
import { TransactiosService } from '../transactions.service';
import * as _ from 'lodash';
import { IReportEntry } from '../IReportEntry';
import { BalanceReportService } from './balance-report.service';

@Component({
  selector: 'pm-balance-report',
  templateUrl: './balance-report.component.html',
  styleUrls: ['./balance-report.component.css'],
})
export class BalanceReportComponent implements OnInit {
  readonly pageTitle: string = "Budget Report";
  report: IReportEntry[] = [];
  errorMessage: any;
  readonly groupByProperties: string[] = ["date", "category"];
  groupByProperty: string = this.groupByProperties[0];
  showAverages: boolean = false;

  sortBy: string = 'key';
  sortOrder: number = 1;
  readonly orderOptions: string[] = ['asc', 'desc'];

  constructor(private _transactionsService: TransactiosService,
              private _balanceReportService: BalanceReportService) { }
  
  ngOnInit() {
    this._transactionsService.getHttpTransactions().subscribe(
      transactions => { this._balanceReportService.accountGroups = _.groupBy(transactions, 'account'); },
      error => this.errorMessage = <any>error
    );
  }
  
  selectedAccountsChanged(selectedAccounts: string[]) {
    this._balanceReportService.selectedAccounts = selectedAccounts;
    this.report = this._balanceReportService.generateReport(this.groupByProperty);
  }
 
  selectedCategoriesChanged(selectedCategories: string[]) {
    this._balanceReportService.selectedCategories = selectedCategories;
    this.report = this._balanceReportService.generateReport(this.groupByProperty);
  }

  generateReport() {
    this.report = this._balanceReportService.generateReport(this.groupByProperty);
  }

  reorderReport(sortBy: string): any {
    this.sortBy = sortBy;
    this.sortOrder = 1 - this.sortOrder;
    this.report = this._balanceReportService.reorderReport(sortBy, this.orderOptions[this.sortOrder]);
  }

  displayAverages(): boolean {
    return this.groupByProperty == "category" && this.showAverages;
  }
}
