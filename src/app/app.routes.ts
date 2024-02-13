import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MintPageComponent } from './components/mint-page/mint-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'mintCubs', component: MintPageComponent },
];
