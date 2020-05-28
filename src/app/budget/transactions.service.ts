import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ITransaction } from "./ITransaction";
import { throwError as observableThrowError,  Observable, of, ReplaySubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TransactiosService {
    private _transactionsUrl = './api/transactions/transactions.json';
    private transactions : ITransaction[];
    private transactionsSubject = new ReplaySubject<ITransaction[]>(1);

    constructor(private _http: HttpClient) {
        this._http.get<ITransaction[]>(this._transactionsUrl)
                  .pipe(catchError(this.handleError))
                  .subscribe(
                    transactions => {
                          this.transactions = transactions;
                          this.transactionsSubject.next(this.transactions);
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
        console.log('UploadFile')
        let reader = new FileReader();
        reader.onload = () => {
            var uploadedTransactions: ITransaction[] = JSON.parse(reader.result.toString());
            this.transactions = uploadedTransactions;
            this.transactionsSubject.next(this.transactions)
        }
        reader.readAsText(fileToUpload);
    }
}