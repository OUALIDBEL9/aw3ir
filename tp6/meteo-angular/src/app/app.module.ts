import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { MeteoComponent } from './meteo/meteo.component';
import { MeteoDetailComponent } from './meteo-detail/meteo-detail.component';

const appRoutes: Routes = [
  { path: '', component: MeteoComponent },
  { path: 'meteo/:name', component: MeteoDetailComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    MeteoComponent,
    MeteoDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }