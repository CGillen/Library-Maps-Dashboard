import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { LibRange } from 'models/lib-range';
import { LibRangeService } from 'services/lib-range.service';

@Component({
  selector: 'app-lib-range-search',
  templateUrl: './lib-range-search.component.html',
  styleUrls: [ './lib-range-search.component.scss' ]
})
export class LibRangeSearchComponent implements OnInit {
  libRanges$!: Observable<LibRange[]>;
  private searchTerms = new Subject<string>();

  constructor(private libRangeService: LibRangeService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.libRanges$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.libRangeService.searchLibRanges(term)),
    );
  }
}