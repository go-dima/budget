import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Dictionary, flatMap, groupBy, keys, orderBy, sortedUniq, uniq } from 'lodash';
import { AccountsService } from '../accounts-filter/accounts.service';
import Common from '../common';
import DateUtils from '../date-utils';
import { ITransaction } from '../ITransaction';

@Component({
    selector: 'pm-transactions-chart',
    templateUrl: './transactions-chart.component.html',
    styleUrls: ['./transactions-chart.component.css']
})
export class TransactionsChartComponent implements OnInit {
    @ViewChild('lineChart', { static: true }) private chartRef;
    chart: any;
    colorOptions: string[] = [
        'rgba(255, 0, 0, 0.3)', // red
        'rgba(0, 255, 0, 0.3)', // green
        'rgba(0, 0, 255, 0.3)', // blue
        'rgba(0, 0, 0, 0.3)' // black
    ];
    all_dates: string[];

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

    redrawChart(self: TransactionsChartComponent) {
        const accounts = this._accountsService.selectedAccounts;
        if (accounts == undefined)
            return;

        self.all_dates = orderBy(
            uniq(this._transactions.map(t => t.date)),
            DateUtils.sortableDate,
            'asc');

        let colorIdx = 0;
        const groupedByAccount = groupBy(this._transactions, t => t.account)
        const graphDataset = accounts.map(function (account) {
            const byDate = groupBy(groupedByAccount[account], t => t.date)
            const dateData: ITransaction[] =
                setBalanceByOrder(
                    orderBy(
                        keys(byDate).map(date => calcDailyTotal(byDate, date, account)), // daily accumulated transactions
                        Common.transactionSortKey,
                        'asc'))
            const dataColor = self.calcColor(account, colorIdx)
            if (!account.includes("_"))
                colorIdx++

            return {
                data: dateData.map((t: ITransaction) => { return { x: self.all_dates.indexOf(t.date), y: t.balance } }),
                label: account,
                fill: false,
                borderColor: dataColor,
                backgroundColor: dataColor
            };
        })
        this.drawChartJsGraph(graphDataset);
    }

    calcColor(toColor: string, idx: number): string {
        if (!toColor.includes("_"))
            return this.colorOptions[idx]

        const ascii = toColor.split('').map(char => char.charCodeAt(0)).reduce((a, b) => a + b) % 256
        return `rgba(${3 * ascii % 256}, ${0.5 * ascii % 256}, ${ascii % 256}, 0.6)`
    }

    private drawChartJsGraph(graphDataset: any[]) {
        // clear old data, if exists
        if (this.chart != undefined)
            this.chart.destroy();

        this.chart = new Chart(this.chartRef.nativeElement, {
            type: 'line',
            data: {
                labels: sortedUniq(flatMap(graphDataset, elem => flatMap(elem.data, elem => +elem.x)).sort((n1, n2) => n1 - n2)),
                datasets: graphDataset
            },
            options: {
                responsive: false,
                legend: {
                    display: true
                },
                scales: {
                    xAxes: [{
                        display: false
                    }],
                    yAxes: [{
                        display: true
                    }],
                }
            }
        });
    }
}

function calcDailyTotal(byDate: Dictionary<ITransaction[]>, date: string, account: string) {
    const dateTotal = byDate[date].map(a => a.amount).reduce((a, b) => a + b, 0);
    return {
        account: account,
        date: date,
        amount: dateTotal,
        balance: byDate[date].length > 1 ? 0 : byDate[date][0].balance,
        category: "Daily",
        comments: "",
        description: "Daily",
        reference: 0
    };
}

function setBalanceByOrder(dateData: ITransaction[]) {
    for (let index = 0; index < dateData.length; index++) {
        const element: ITransaction = dateData[index];
        const previousBalance = index > 0 ? dateData[index - 1].balance : 0;
        if (element.balance == 0)
            element.balance = previousBalance + element.amount;
    }
    return dateData
}
