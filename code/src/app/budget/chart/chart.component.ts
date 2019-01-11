import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { BalanceReportService } from '../balance-report/balance-report.service';
import { IReportEntry } from '../IReportEntry';
import * as _ from 'lodash';

@Component({
  selector: 'pm-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @ViewChild('lineChart') private chartRef;
  chart: any; 

  constructor(private _balanceReportService: BalanceReportService) {}

  ngOnInit() {
    this._balanceReportService.generatedReport.subscribe(($event) => this.onReportGenerated($event));
  }

  onReportGenerated(report: IReportEntry[]) {
    let labels = _.map(report, entry => entry.key);
    let balanceData = _.map(report, entry => entry.balance);
    let incomeData = _.map(report, entry => entry.income.total);
    let expenseData = _.map(report, entry => entry.expense.total);
    
    // clear old data, if exists
    if (this.chart != undefined)
      this.chart.destroy();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { data: balanceData, backgroundColor: 'rgba(0, 0, 255, 0.3)' },
          { data: incomeData, backgroundColor: 'rgba(0, 255, 0, 0.3)' },
          { data: expenseData, backgroundColor: 'rgba(255, 0, 0, 0.3)' }
        ]
      },
      options: {
        responsive: false,
        legend: {
          display: false
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