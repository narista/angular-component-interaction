import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProcessingComponent } from './processing/processing.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'processing', component: ProcessingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
