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

@NgModule({
  declarations: [
    AppComponent, // Declare your AppComponent
    MintPanelComponent, // Any other components you have
    TopToolbarComponent, // Any other components you have
    HomePageComponent, // Any other components you have
    BuyPageComponent,

    // Any other components you have
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    StoreModule.forRoot({ fuzzFarmState: reducers }),
    EffectsModule.forRoot([ContractEffects]), // Initialize NgRx Effects if you have any
    // Other module imports
  ],
  providers: [], // Global services
  bootstrap: [AppComponent], // Bootstrap your AppComponent
})
export class AppModule {}
