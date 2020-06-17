import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ITransaction } from "./ITransaction";
import { throwError as observableThrowError,  Observable, of, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import readXlsxFile from 'read-excel-file';
import { zipObject } from "lodash"

@Injectable()
export class TransactiosService {
    private _transactionsUrl = './api/transactions/transactions.json';
    private transactionsSubject = new ReplaySubject<ITransaction[]>(1);

    constructor(private _http: HttpClient) {
        this._http.get<ITransaction[]>(this._transactionsUrl)
                  .pipe(catchError(this.handleError))
                  .subscribe(
                    transactions => {
                          this.transactionsSubject.next(transactions);
                      },
                  );
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
                var uploadedTransactions: ITransaction[] = JSON.parse(reader.result.toString());
                this.transactionsSubject.next(uploadedTransactions)
            }
            reader.readAsText(fileToUpload);
        }

        if (fileType === 'xlsx') {
            readXlsxFile(fileToUpload).then((rows: any[]) => {
                const headerRow = rows[0];
                var uploadedTransactions: ITransaction[] = []
                rows.slice(1).forEach(row => {
                    let t: ITransaction = <ITransaction><unknown>zipObject(headerRow, row)
                    t.amount = parseInt(row[headerRow.indexOf('amount')], 10)
                    t.balance = parseInt(row[headerRow.indexOf('balance')], 10)
                    uploadedTransactions.push(t)
                });
                this.transactionsSubject.next(uploadedTransactions)
            })
        }
    }
}