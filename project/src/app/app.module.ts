import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCVTiu-6D-olOCESaB5H4D4wI2gA_L3Y5k',
      libraries: ['places']
    })
  ],
  providers: [
    GoogleMapsAPIWrapper,
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
