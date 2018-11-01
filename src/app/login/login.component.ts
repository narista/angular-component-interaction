import { Component, OnInit } from '@angular/core';
import { ComponentInteractionService } from 'src/component-interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private interactionService: ComponentInteractionService) { }

  ngOnInit() {
    // Publish the title text!
    this.interactionService.publish('Login');
  }

}
