import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Floor } from 'models/floor';
import { MessageService } from 'services/message.service';
import { LibRange } from 'models/lib-range';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getFloors(): Observable<Floor[]> {
    this.log('FloorService: fetched floor')

    return this.http.get<Floor[]>('floors.json')
      .pipe(
        tap(_ => this.log('fetched Floors')),
        catchError(this.handleError<Floor[]>('getFloors', []))
      );
  }

  getFloor(id: number): Observable<Floor> {
    // For now, assume that a floor with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    return this.http.get<Floor>(`floors/${id}.json`)
      .pipe(
        tap(_ => this.log(`FloorService: fetched Floor ${id}`)),
        catchError(
          this.handleError<Floor>(`getFloor id=${id}`))
      );
  }

  getLibRanges(id: number): Observable<LibRange[]> {
    return this.http.get<LibRange[]>(`floors/${id}/lib_ranges.json`)
      .pipe(
        tap(_ => this.log(`FloorService: fetched LibRanges for Floor ${id}`)),
        catchError(
          this.handleError<LibRange[]>(`getLibranges floor_id=${id}`))
      );
  }

  /* GET Floor whose name contains search term */
  searchFloors(term: string): Observable<Floor[]> {
    if (!term.trim()) {
      // if not search term, return empty floor array.
      return of([]);
    }
    return this.http.get<Floor[]>(`floors.json?starts_with=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found floor matching "${term}"`) :
        this.log(`no floor matching "${term}"`)),
      catchError(this.handleError<Floor[]>('searchFloors', []))
    );
  }

  updateFloor(floor: Floor): Observable<any> {
    return this.http.put(`floors/${floor.id}.json`, floor, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated floor id=${floor.id}`)),
        catchError(this.handleError<any>('updateFloor'))
      )
  }
  putFloor(id: number, floor: FormData): Observable<any> {
    return this.http.put(`floors/${id}`, floor)
      .pipe(
        tap(_ => this.log(`updated floor id=${floor.get('id')}`)),
        catchError(this.handleError<any>('updateFloor'))
      )
  }

  /** POST: add a new floor to the server */
  addFloor(floor: Floor): Observable<Floor> {
    return this.http.post<Floor>('floors.json', floor, this.httpOptions).pipe(
      tap((newFloor: Floor) => this.log(`added floor w/ id=${newFloor.id}`)),
      catchError(this.handleError<Floor>('addFloor'))
    );
  }

  /** DELETE: delete the floor from the server */
  deleteFloor(id: number): Observable<Floor> {
    return this.http.delete<Floor>(`floors/${id}.json`, this.httpOptions).pipe(
      tap(_ => this.log(`deleted floor id=${id}`)),
      catchError(this.handleError<Floor>('deleteFloor'))
    );
  }

  private log(message: string) {
    this.messageService.add(`FloorService: ${message}`);
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
