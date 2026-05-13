import { Component, OnInit } from '@angular/core';

import { Shelf } from 'models/shelf';
import { ShelfService } from 'services/shelf.service';
import { MessageService } from 'services/message.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  shelves: Shelf[] = [];
  shelf?: Shelf;

  constructor(private shelfService: ShelfService, private messageService: MessageService) { }

  getShelves(): void {
    this.shelfService.getShelves()
    .subscribe(shelves => {
      this.shelves = shelves;
      this.shelf = shelves[0];
    });
  }

  ngOnInit(): void {
    this.getShelves();
  }
}
