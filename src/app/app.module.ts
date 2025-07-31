import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuComponent } from './menu/menu.component';
import { reducers } from './store/reducers';
import { metaReducers } from './store/reducers/local-storage-sync.reducer';
import { GameEffects } from './store/effects/game.effects';

@NgModule({
  declarations: [AppComponent, NavbarComponent, MenuComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,FormsModule, StoreModule.forRoot(reducers, { metaReducers }), EffectsModule.forRoot([GameEffects])],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
