import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ITransaction } from "./ITransaction";
import { throwError as observableThrowError,  Observable, of, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
        let reader = new FileReader();
        reader.onload = () => {
            var uploadedTransactions: ITransaction[] = JSON.parse(reader.result.toString());
            this.transactionsSubject.next(uploadedTransactions)
        }
        reader.readAsText(fileToUpload);
    }
}