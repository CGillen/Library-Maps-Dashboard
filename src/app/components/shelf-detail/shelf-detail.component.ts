import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { Shelf } from 'models/shelf';
import { ShelfService } from 'services/shelf.service';

@Component({
  selector: 'app-shelf-detail',
  templateUrl: './shelf-detail.component.html',
  styleUrls: ['./shelf-detail.component.scss']
})
export class ShelfDetailComponent implements OnInit {
  @Input() shelf?: Shelf;

  constructor(
    private route: ActivatedRoute,
    private shelfService: ShelfService,
    private cookieService: CookieService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getShelf();
  }

  getShelf(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.shelfService.getShelf(id)
      .subscribe(shelf => this.shelf = shelf);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.shelf) {
      this.shelfService.updateShelf(this.shelf)
        .subscribe(response => {
          this.goBack()
        });
    }
  }
}
