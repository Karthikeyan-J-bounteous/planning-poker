import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { AbbreviateNamePipe } from '../pipes/abbreviate-name.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, InfoModalComponent, AbbreviateNamePipe]
})
export class HomePageModule {}
