import { Component, OnInit } from '@angular/core';
import { ComponentInteractionService } from 'src/component-interaction.service';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {

  constructor(private interactionService: ComponentInteractionService) { }

  ngOnInit() {
    this.interactionService.publish('Processing');
  }

}
