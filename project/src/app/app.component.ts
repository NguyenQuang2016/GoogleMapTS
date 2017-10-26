import { Component, OnInit } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 6.809007;

  private _wrapper: GoogleMapsAPIWrapper;
  ngOnInit() {}
  constructor(private mapsAPILoader: MapsAPILoader) {

      }

  myClickFunc(): void {
    this.mapsAPILoader.load().then(() => {

      const opt: google.maps.MapOptions = {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      };
      const mapDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('ggmap');
      const m = new google.maps.Map(mapDiv, opt);
      const placeService =  new google.maps.places.PlacesService(mapDiv);
      const request: google.maps.places.PlaceSearchRequest = {
        location: {lat: -33.867, lng: 151.195},
        radius: 500,
        type: 'store',
      };
      placeService.nearbySearch(request, (result, response) => {
        console.log(result);
      });

    });

  }
}

