import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ITransaction } from "./ITransaction";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class TransactiosService {
    private _transactionsUrl = './api/transactions/transactions.json';

    constructor(private _http: HttpClient) {}

    getHttpTransactions(): Observable<ITransaction[]>{
        return this._http.get<ITransaction[]>(this._transactionsUrl)
                   .do(data => console.log('All: ' + JSON.stringify(data)))
                   .catch(this.handleError);
    }

    getTransaction(reference: number): Observable<ITransaction> {
        return this.getHttpTransactions()
            .map((transactions: ITransaction[]) => transactions.find(p => p.reference === reference));
    }

    handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
}