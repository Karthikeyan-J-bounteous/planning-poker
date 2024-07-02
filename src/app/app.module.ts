import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuComponent } from './menu/menu.component';
import { QRCodeModule } from 'angularx-qrcode';
import { reducers } from './store/reducers';
import { metaReducers } from './store/reducers/local-storage-sync.reducer';

@NgModule({
  declarations: [AppComponent, NavbarComponent, MenuComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, QRCodeModule, StoreModule.forRoot(reducers, { metaReducers }),],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
