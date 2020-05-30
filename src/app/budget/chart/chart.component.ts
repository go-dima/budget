import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { BalanceReportService } from '../balance-report/balance-report.service';
import { IReportEntry } from '../IReportEntry';
import { map } from 'lodash';

@Component({
  selector: 'pm-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @ViewChild('lineChart', {static: true}) private chartRef;
  chart: any;

  constructor(private _balanceReportService: BalanceReportService) { }

  ngOnInit() {
    this._balanceReportService.generatedReportSubject.subscribe(($event: IReportEntry[]) => this.onReportGenerated($event));
  }

  onReportGenerated(report: IReportEntry[]) {
    let labels = map(report, entry => entry.key);
    let overallData = map(report, entry => entry.overall);
    let incomeData = map(report, entry => entry.income.total);
    let expenseData = map(report, entry => entry.expense.total);

    // clear old data, if exists
    if (this.chart != undefined)
      this.chart.destroy();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { 
            label: 'Overall', data: overallData, backgroundColor: 'rgba(0, 0, 255, 0.3)'
          },
          {
            label: 'Income', data: incomeData, backgroundColor: 'rgba(0, 255, 0, 0.3)'
          },
          {
            label: 'Expense', data: expenseData, backgroundColor: 'rgba(255, 0, 0, 0.3)'
          }
        ]
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