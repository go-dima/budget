import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ITransaction } from "./ITransaction";
import { throwError as observableThrowError,  Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TransactiosService {
    private _transactionsUrl = './api/transactions/transactions.json';
    private uploadedTransactions : Observable<ITransaction[]>;

    constructor(private _http: HttpClient) {}

    getHttpTransactions(): Observable<ITransaction[]>{
        if(this.uploadedTransactions != undefined)
            return this.uploadedTransactions;
        else
            return this._http.get<ITransaction[]>(this._transactionsUrl)
                             .pipe(catchError(this.handleError));
    }

    getTransaction(reference: number): Observable<ITransaction> {
        return this.getHttpTransactions().pipe(
            map((transactions: ITransaction[]) => transactions.find(p => p.reference === reference)));
    }

    handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return observableThrowError(err.message);
    }

    uploadFile(fileToUpload: File){ 
        let reader = new FileReader();
        reader.onload = () => {
            // var text = reader.result;
            // console.log(text);
            var arr: ITransaction[] = JSON.parse(reader.result.toString());
            this.uploadedTransactions = of(arr);
        }
        reader.readAsText(fileToUpload);
    }
}