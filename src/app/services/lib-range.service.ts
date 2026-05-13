import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LibRange } from 'models/lib-range';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class LibRangeService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getLibRanges(): Observable<LibRange[]> {
    this.log('fetched libRange')

    return this.http.get<LibRange[]>('lib_ranges.json')
      .pipe(
        tap(_ => this.log('fetched LibRanges')),
        catchError(this.handleError<LibRange[]>('getLibRanges', []))
      );
  }

  getLibRange(id: number): Observable<LibRange> {
    // For now, assume that a libRange with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    return this.http.get<LibRange>(`lib_ranges/${id}.json`)
      .pipe(
        tap(_ => this.log(`fetched LibRange ${id}`)),
        catchError(
          this.handleError<LibRange>(`getLibRange id=${id}`))
      );
  }

  /* GET LibRange whose name contains search term */
  searchLibRanges(term: string): Observable<LibRange[]> {
    if (!term.trim()) {
      // if not search term, return empty libRange array.
      return of([]);
    }
    return this.http.get<LibRange[]>(`lib_ranges.json?starts_with=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found libRange matching "${term}"`) :
        this.log(`no libRange matching "${term}"`)),
      catchError(this.handleError<LibRange[]>('searchLibRanges', []))
    );
  }

  updateLibRange(libRange: LibRange): Observable<any> {
    return this.http.put(`lib_ranges/${libRange.id}.json`, libRange, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated libRange id=${libRange.id}`)),
        catchError(this.handleError<any>('updateLibRange'))
      )
  }

  /** POST: add a new libRange to the server */
  addLibRange(libRange: LibRange): Observable<LibRange> {
    return this.http.post<LibRange>('lib_ranges.json', libRange, this.httpOptions).pipe(
      tap((newLibRange: LibRange) => this.log(`added libRange w/ id=${newLibRange.id}`)),
      catchError(this.handleError<LibRange>('addLibRange'))
    );
  }

  /** DELETE: delete the libRange from the server */
  deleteLibRange(id: number): Observable<LibRange> {
    return this.http.delete<LibRange>(`lib_ranges/${id}.json`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted libRange id=${id}`)),
      catchError(this.handleError<LibRange>('deleteLibRange'))
    );
  }

  private log(message: string) {
    this.messageService.add(`LibRangeService: ${message}`);
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
