import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cloneDeep, flatMap, orderBy, zipObject } from 'lodash';
import readXlsxFile from 'read-excel-file';
import { Observable, ReplaySubject, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Common from './common';
import { ITransaction } from './ITransaction';

@Injectable()
export class TransactiosService {
    private _transactionsUrl = './api/transactions/transactions.json';
    private transactionsSubject = new ReplaySubject<ITransaction[]>(1);
    private specialCategories = ["קופת גמל", "חיסכון", "השקעה"]

    constructor(private _http: HttpClient) {
        this._http.get<ITransaction[]>(this._transactionsUrl)
                  .pipe(catchError(this.handleError))
                  .subscribe(transactions => { this.publish(transactions) });
    }

    getAllTransactions(): Observable<ITransaction[]>{
        return this.transactionsSubject.asObservable();
    }

    getTransaction(reference: number): Observable<ITransaction> {
        return this.getAllTransactions().pipe(
            map((transactions: ITransaction[]) => transactions.find(p => p.reference === reference)));
    }

    handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return observableThrowError(err.message);
    }

    uploadFile(fileToUpload: File){
        const lastDot = fileToUpload.name.lastIndexOf(".")
        const fileType = fileToUpload.name.slice(lastDot + 1)
        
        if (fileType === 'json') {
            const reader = new FileReader();
            reader.onload = () => {
                const uploadedTransactions: ITransaction[] = JSON.parse(reader.result.toString());
                this.publish(uploadedTransactions)
            }
            reader.readAsText(fileToUpload);
        }

        if (fileType === 'xlsx') {
            readXlsxFile(fileToUpload).then((rows: any[]) => {
                const headerRow = rows[0];
                const uploadedTransactions: ITransaction[] = rows.slice(1).map(row => {
                    let t: ITransaction = <ITransaction><unknown>zipObject(headerRow, row)
                    t.amount = parseInt(row[headerRow.indexOf('amount')], 10)
                    t.balance = parseInt(row[headerRow.indexOf('balance')], 10)
                    return t
                });
                this.publish(uploadedTransactions)
            })
        }
    }

    publish(transactions: ITransaction[]) {
        transactions = transactions.concat(this.parseSpecial(transactions))
        this.transactionsSubject.next(transactions)
    }

    private parseSpecial(uploadedTransactions: ITransaction[]): ITransaction[] {
        return flatMap(this.specialCategories, (category: string) => {
            const specialTransactions = uploadedTransactions.filter(t => t.category == category).map(cloneDeep);
            const sortedTransactions = orderBy(specialTransactions, Common.transactionSortKey, 'asc');
            sortedTransactions.forEach((t: ITransaction) => {
                t.account = '_' + t.category + '_';
                t.balance = -t.amount;
                t.amount = -t.amount;
            });
            for (let i = 1; i < sortedTransactions.length; i++) {
                sortedTransactions[i].balance += sortedTransactions[i - 1].balance;
            }
            return sortedTransactions
        })
    }
}
