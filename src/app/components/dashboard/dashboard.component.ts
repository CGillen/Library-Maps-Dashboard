import { Component, OnInit } from '@angular/core';
import { Bay } from 'models/bay';
import { LibRange } from 'models/lib-range';
import { Shelf } from 'models/shelf';
import { environment } from '../../../environments/environment';

import { BayService } from 'services/bay.service';
import { LibRangeService } from 'services/lib-range.service';
import { ShelfService } from 'services/shelf.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  shelves: Shelf[] = [];
  bays: Bay[] = [];
  libRanges: LibRange[] = [];
  environment = environment;

  constructor(private shelfService: ShelfService,
              private bayService: BayService,
              private libRangeServer: LibRangeService) { }

  ngOnInit(): void {
    this.getShelves();
    this.getBays();
    this.getLibRanges();
  }

  getShelves(): void {
    this.shelfService.getShelves()
      .subscribe(shelves => this.shelves = shelves);
  }

  getBays(): void {
    this.bayService.getBays()
      .subscribe(bays => this.bays = bays);
  }

  getLibRanges(): void {
    this.libRangeServer.getLibRanges()
      .subscribe(libRanges => this.libRanges = libRanges);
  }
}
