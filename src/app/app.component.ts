import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ComponentInteractionService } from 'src/component-interaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Title]
})

export class AppComponent {
  // The initial vslue of the title.
  baseTitle = 'Top';
  title = this.baseTitle;

  constructor(private pageTitle: Title, private interactionService: ComponentInteractionService) {
    // Subscribe the event from the component interaction service
    this.interactionService.event$.subscribe(text => this.onTitleChanged(text));
  }

  // Sets the title of the browser title bar and the title in the page.
  onTitleChanged(event: string) {
    this.title = event;
    this.pageTitle.setTitle(`${this.baseTitle} - ${event}`);
  }
}
