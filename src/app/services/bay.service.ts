import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Bay } from 'models/bay';
import { MessageService } from 'services/message.service';

@Injectable({
  providedIn: 'root'
})
export class BayService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getBays(): Observable<Bay[]> {
    this.log('BayService: fetched bay')

    return this.http.get<Bay[]>('bays.json')
      .pipe(
        tap(_ => this.log('fetched Bays')),
        catchError(this.handleError<Bay[]>('getBays', []))
      );
  }

  getBay(id: number): Observable<Bay> {
    // For now, assume that a bay with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    return this.http.get<Bay>(`bays/${id}.json`)
      .pipe(
        tap(_ => this.log(`BayService: fetched Bay ${id}`)),
        catchError(
          this.handleError<Bay>(`getBay id=${id}`))
      );
  }

  /* GET Bay whose name contains search term */
  searchBays(term: string): Observable<Bay[]> {
    if (!term.trim()) {
      // if not search term, return empty bay array.
      return of([]);
    }
    return this.http.get<Bay[]>(`bays.json?starts_with=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found bay matching "${term}"`) :
        this.log(`no bay matching "${term}"`)),
      catchError(this.handleError<Bay[]>('searchBays', []))
    );
  }

  updateBay(bay: Bay): Observable<any> {
    return this.http.put(`bays/${bay.id}.json`, bay, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated bay id=${bay.id}`)),
        catchError(this.handleError<any>('updateBay'))
      )
  }

  /** POST: add a new bay to the server */
  addBay(bay: Bay): Observable<Bay> {
    return this.http.post<Bay>('bays.json', bay, this.httpOptions).pipe(
      tap((newBay: Bay) => this.log(`added bay w/ id=${newBay.id}`)),
      catchError(this.handleError<Bay>('addBay'))
    );
  }

  /** DELETE: delete the bay from the server */
  deleteBay(id: number): Observable<Bay> {
    return this.http.delete<Bay>(`bays/${id}.json`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted bay id=${id}`)),
      catchError(this.handleError<Bay>('deleteBay'))
    );
  }

  private log(message: string) {
    this.messageService.add(`BayService: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
