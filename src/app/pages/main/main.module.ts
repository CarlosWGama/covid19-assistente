import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { Chat } from './modulos/chat';
import { Covid19Modulo } from './modulos/covid19';
import { EstatisticaModulo } from './modulos/estatistica';
import { LocaisApoioModulo } from './modulos/locais-apoio';
import { SintomasModulo } from './modulos/sintomas';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [MainPage]
})
export class MainPageModule {}
