import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Bay } from 'models/bay';
import { BayService } from 'services/bay.service';

@Component({
  selector: 'app-bay-search',
  templateUrl: './bay-search.component.html',
  styleUrls: ['./bay-search.component.scss']
})
export class BaySearchComponent implements OnInit {
  bays$!: Observable<Bay[]>;
  private searchTerms = new Subject<string>();

  constructor(private bayService: BayService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.bays$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.bayService.searchBays(term)),
    );
  }
}