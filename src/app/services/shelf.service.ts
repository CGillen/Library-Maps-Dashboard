import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Shelf } from 'models/shelf';
import { MessageService } from 'services/message.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getShelves(): Observable<Shelf[]> {
    this.log('ShelfService: fetched shelves')

    return this.http.get<Shelf[]>('shelves.json')
      .pipe(
        tap(_ => this.log('fetched Shelves')),
        catchError(this.handleError<Shelf[]>('getShelves', []))
      );
  }

  getShelf(id: number): Observable<Shelf> {
    // For now, assume that a shelf with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    return this.http.get<Shelf>(`shelves/${id}.json`)
      .pipe(
        tap(_ => this.log(`ShelfService: fetched Shelf ${id}`)),
        catchError(
          this.handleError<Shelf>(`getShelf id=${id}`))
      );
  }

  /* GET shelves which contains call_number */
  searchShelves(call_number: string): Observable<Shelf[]> {
    if (!call_number.trim()) {
      // if not search term, return empty shelf array.
      return of([]);
    }
    return this.http.get<Shelf[]>(`shelves.json?cn=${call_number}`).pipe(
      tap(x => x.length ?
        this.log(`found shelves matching "${call_number}"`) :
        this.log(`no shelves matching "${call_number}"`)),
      catchError(this.handleError<Shelf[]>('searchShelves', []))
    );
  }

  updateShelf(shelf: Shelf): Observable<any> {
    return this.http.put(`shelves/${shelf.id}.json`, shelf, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated shelf id=${shelf.id}`)),
        catchError(this.handleError<any>('updateShelf'))
      )
  }

  /** POST: add a new shelf to the server */
  addShelf(shelf: Shelf): Observable<Shelf> {
    return this.http.post<Shelf>('shelves.json', shelf, this.httpOptions).pipe(
      tap((newShelf: Shelf) => this.log(`added shelf w/ id=${newShelf.id}`)),
      catchError(this.handleError<Shelf>('addShel'))
    );
  }

  /** DELETE: delete the shelf from the server */
  deleteShelf(id: number): Observable<Shelf> {
    return this.http.delete<Shelf>(`shelves/${id}.json`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted shelf id=${id}`)),
      catchError(this.handleError<Shelf>('deleteShelf'))
    );
  }

  private log(message: string) {
    this.messageService.add(`ShelfService: ${message}`);
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
