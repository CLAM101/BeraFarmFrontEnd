import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';

import { BuyPageComponent } from './components/buy-page/buy-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  { path: 'buyPage', component: BuyPageComponent },
];
