import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { MintPanelComponent } from './components/mint-panel/mint-panel.component';
import { TopToolbarComponent } from './components/top-toolbar/top-toolbar.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BuyPageComponent } from './components/buy-page/buy-page.component';
import { AppRoutingModule } from './app-routing-module';
import { reducers } from 'src/global-state/reducers';
import { ContractEffects } from 'src/global-state/effects';
import { LoadingPopupComponent } from './components/loading-popup/loading-popup.component';
import { PlayerDashboardComponent } from './components/player-dashboard/player-dashboard.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { ListingModalComponent } from './components/listing-modal/listing-modal.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
@NgModule({
  declarations: [
    AppComponent,
    MintPanelComponent,
    TopToolbarComponent,
    HomePageComponent,
    BuyPageComponent,
    LoadingPopupComponent,
    PlayerDashboardComponent,
    MarketplaceComponent,
    ListingModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    StoreModule.forRoot({ fuzzFarmState: reducers }),
    EffectsModule.forRoot([ContractEffects]),
    FormsModule, // Add FormsModule to the imports array
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
