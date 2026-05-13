import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Shelf } from 'models/shelf';
import { ShelfService } from 'services/shelf.service';

@Component({
  selector: 'app-shelf-search',
  templateUrl: './shelf-search.component.html',
  styleUrls: [ './shelf-search.component.scss' ]
})
export class ShelfSearchComponent implements OnInit {
  shelves$!: Observable<Shelf[]>;
  private searchTerms = new Subject<string>();

  constructor(private shelfService: ShelfService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.shelves$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.shelfService.searchShelves(term)),
    );
  }
}