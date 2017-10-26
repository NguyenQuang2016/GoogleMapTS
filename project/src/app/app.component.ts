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
  lat = 10.729190;
  lng = 106.721715;
  agmBounds: google.maps.LatLngBounds;
  zoom = 15;
  markers: marker[] = [
  ];

  ngOnInit() {}
  constructor(private mapsAPILoader: MapsAPILoader,
              private wrapper: GoogleMapsAPIWrapper) {}

  DisplayBank(): void {

    this.wrapper.getBounds().then(x => {
      console.log('aaaa:');
      console.log(x);
    });

    this.mapsAPILoader.load().then(() => {

      const opt: google.maps.MapOptions = {
        center: {lat: this.lat, lng: this.lng},
        zoom: this.zoom,
      };

      const mapDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('ggmap');

      const m = new google.maps.Map(mapDiv, opt);
      const placeService =  new google.maps.places.PlacesService(mapDiv);
      const request: google.maps.places.PlaceSearchRequest = {
        location: {lat: this.lat, lng: this.lng},
        bounds: this.agmBounds,
        type: 'bank',
      };
      console.log(request);
      placeService.nearbySearch(request, (results, status) => {
        console.log(results);
        this.PushMarkers(results);
      });
    });
  }

  PushMarkers(marker_arg: google.maps.places.PlaceResult[]): void {
    for (const place_iterator of marker_arg) {
        const new_marker: marker = {
        draggable: false,
        lat: place_iterator.geometry.location.lat(),
        lng: place_iterator.geometry.location.lng(),
      };
      this.markers.push(new_marker);
    }
  }
  boundsChange(event) {
    this.agmBounds = event;
  }

}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

