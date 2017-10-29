import { Component, OnInit } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';

let this_appComponentPointer;

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
  markers: Marker[] = [];
  pagination: google.maps.places.PlaceSearchPagination;
  currentApiRequest: google.maps.places.PlaceSearchRequest = null;
  placeService: google.maps.places.PlacesService;

  // declare semaphore (mutex: true/false) resolve conflict resource
  private mutexPlaceApi: boolean;

  ngOnInit() {  }
  constructor(private mapsAPILoader: MapsAPILoader,
              private wrapper: GoogleMapsAPIWrapper) {
    /* can not use 'this' pointer in lambda expression
    please use this_appComponentPointer. fuck of typeScript/JavaScript */

    this_appComponentPointer = this;
    // Get user position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
    this.mutexPlaceApi = true;
    // Add marker to map
    this.mapsAPILoader.load().then(() => {
      const label: google.maps.MarkerLabel = {
        color: 'blue',
        text: 'User position',
      };
      const icon: google.maps.Icon = {
        url: 'assets/userPos.png',
        scaledSize: new google.maps.Size(50, 50),
        labelOrigin: new google.maps.Point(25, 0),
      };
        const new_marker: Marker = {
          icon: icon,
          draggable: false,
          lat: this.lat,
          lng: this.lng,
          label: label,
      };
      this.markers.push(new_marker);

    });
  }

  DisplayBank(): void {
    for (let i = 1; i < this.markers.length; i++) {
      this.markers.pop();
    }
    this.wrapper.getBounds().then(x => {
      console.log('aaaa:');
      console.log(x);
    });

    this.mapsAPILoader.load().then(() => {

      const opt: google.maps.MapOptions = {
        center: {lat: this.lat, lng: this.lng},
        zoom: this.zoom,
        clickableIcons: false,
      };
      const mapDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('ggmap');
      const m = new google.maps.Map(mapDiv, opt);
      this.placeService =  new google.maps.places.PlacesService(mapDiv);

      this.currentApiRequest = {
        location: {lat: this.lat, lng: this.lng},
        bounds: this.agmBounds,
        type: 'bank',
      };
      this.nearbySearch();
    });
  }
  /* ______________________________________conflict code______________________________________*/
  async nearbySearch(): Promise<void> {
    while (!this.mutexPlaceApi) {
      // waiting for release mutexPlaceApi
    }
    // lock resource when use.
    this.mutexPlaceApi = false;
    this.placeService.nearbySearch(this.currentApiRequest, this.nearBySearchCallback);

    // Google rule (defend when DDoS attack): can not make more than 1 request per 2 seconds
    // delay 2 seconds before next request
    await this.delay(2000);
    // release resource when done.
    this.mutexPlaceApi = true;
  }

  // async function always return a Promise
  async nextPage(): Promise<void> {
    while (!this_appComponentPointer.mutexPlaceApi) {
      // waiting for release mutexPlaceApi
    }
    // lock resource when use.
    this_appComponentPointer.mutexPlaceApi = false;
    for (let i = 0; i < 5; i++) {
      // only load max 100 marker
      console.log('nextPage start', i);
      if (this.pagination.hasNextPage === false) {
        break;
      }
      this.pagination.nextPage();
      console.log('nextPage end', i);
    // Google rule (defend when DDoS attack): can not make more than 1 request per 2 seconds
    // delay 2 seconds before next request
    await this_appComponentPointer.delay(2000);
    // release resource when done.
    this_appComponentPointer.mutexPlaceApi = true;

    }
  }
  /* ___________________________________end conflict code____________________________________*/


   nearBySearchCallback(results, status, pagination): void {
    console.log('results:', results);
    // this_appComponentPointer.PushMarkers(results);
    this_appComponentPointer.pagination = pagination;
  }
  testClick() {
    this.nextPage();
  }


  delay(milliseconds: number): Promise<number> {
    return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve();
            }, milliseconds);
        });
  }

  async PushMarkers(marker_arg: google.maps.places.PlaceResult[]): Promise<void> {
    console.log('PushMarkers');
    if (marker_arg === null) {
      return;
    }
    for (const place_iterator of marker_arg) {
      const label: google.maps.MarkerLabel = {
        color: 'red',
        text: 'Bank',
      };
      const icon: google.maps.Icon = {
        url: 'assets/Bank.png',
        scaledSize: new google.maps.Size(40, 40),
      };
        const new_marker: Marker = {
          icon: icon,
          draggable: false,
          lat: place_iterator.geometry.location.lat(),
          lng: place_iterator.geometry.location.lng(),
      };
      this.markers.push(new_marker);
    }
  }

  amgBoundsChange(event) {
    this.agmBounds = event;
  }
  amgCenterChange(event) {
    if (this_appComponentPointer.currentApiRequest === null) {
      // this_appComponentPointer.currentApiRequest will be init when click label
      return;
    }
    this.mapsAPILoader.load().then(() => {
      // can not use 'this' pointer in here "TypeScript/JavaScript Hell"
      this_appComponentPointer.currentApiRequest.location = {lat: this.lat, lng: this.lng};
      this.nearbySearch();
    });
  }
}
// just an interface for type safety.
interface Marker {
  icon: string|google.maps.Icon|google.maps.Symbol;
  lat: number;
  lng: number;
  label?: google.maps.MarkerLabel;
  draggable: boolean;
}
