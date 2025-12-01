import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeteoComponent } from './meteo/meteo.component';
import { MeteoDetailComponent } from './meteo-detail/meteo-detail.component';

const routes: Routes = [];
const appRoutes: Routes = [
  {
    path: "", // la page principale utilisera le component suivant
    component: MeteoComponent,
  },
  {
    path: "meteo/:name", // la page affichant la météo prendra comme paramètre 'name'
    component: MeteoDetailComponent, // Ce component fera l'appel AJAX et afficher les données reçues par openWeatherMap
  },
  {
    path: "**", // un chemin vers une page inexistante redirigera vers '/'
    redirectTo: "/",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
