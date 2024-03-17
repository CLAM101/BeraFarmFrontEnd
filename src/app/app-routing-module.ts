import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BuyPageComponent } from './components/buy-page/buy-page.component';
import { PlayerDashboardComponent } from './components/player-dashboard/player-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'buyPage', component: BuyPageComponent },
  { path: 'playerDashboard', component: PlayerDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
