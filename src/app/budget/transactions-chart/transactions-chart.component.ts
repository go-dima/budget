import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { ITransaction } from '../ITransaction';
import { map, orderBy, groupBy } from 'lodash';
import { AccountsService } from '../accounts-filter/accounts.service';
import DateUtils from '../date-utils';

@Component({
  selector: 'pm-transactions-chart',
  templateUrl: './transactions-chart.component.html',
  styleUrls: ['./transactions-chart.component.css']
})
export class TransactionsChartComponent implements OnInit {
  @ViewChild('lineChart', {static: true}) private chartRef;
  chart: any;
  colorOptions: string[] = [
    'rgba(0, 0, 255, 0.3)',
    'rgba(0, 255, 0, 0.3)',
    'rgba(255, 0, 0, 0.3)',
    'rgba(255, 255, 255, 0.3)'
  ];

  _transactions: ITransaction[];
  @Input() get transactions(): ITransaction[] {
      return this._transactions;
  }
  set transactions(value: ITransaction[]) {
      this._transactions = value;
      this.redrawChart(this);
  }

  constructor(private _accountsService: AccountsService) { }

  ngOnInit() { 
    this.redrawChart(this);
  }

  orderTransactions(transactions: ITransaction[]): ITransaction[] {
    let sorted = orderBy(
      transactions,
      t => DateUtils.extractSortKey(t.date),
      'asc');
    return sorted;
  }

  redrawChart(self: TransactionsChartComponent) {
    let accounts = this._accountsService.selectedAccounts;
    if (accounts == undefined)
      return;
      
    let grouped = groupBy(this._transactions, t => t.account);
    let graphDataset = [];
    let maxData = 0;
    let colorIdx = 0;
    accounts.forEach(function (account) {
      let dataset = {
        data:  map(self.orderTransactions(grouped[account]), t => t.balance),
        label: account,
        fill: false,
        backgroundColor: self.colorOptions[colorIdx++]
      };
      graphDataset.push(dataset);
      maxData = Math.max(maxData, dataset.data.length);
    });
    
    // clear old data, if exists
    if (this.chart != undefined)
      this.chart.destroy();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: new Array<string>(maxData),
        datasets: graphDataset
      },
      options: {
        responsive: false,
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}
