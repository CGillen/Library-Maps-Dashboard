import { Component, OnInit } from '@angular/core';

import { Bay } from 'models/bay';
import { BayService } from 'services/bay.service';
import { MessageService } from 'services/message.service';

@Component({
  selector: 'app-bay',
  templateUrl: './bay.component.html',
  styleUrls: ['./bay.component.scss']
})
export class BayComponent implements OnInit {
  bays: Bay[] = [];
  bay?: Bay;

  constructor(private bayService: BayService, private messageService: MessageService) { }

  getBays(): void {
    this.bayService.getBays()
        .subscribe(bays => {
          this.bays = bays
          this.bay = bays[0];
        });
  }

  ngOnInit(): void {
    this.getBays();
  }
}
