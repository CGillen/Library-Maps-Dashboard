import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { APIInterceptor } from 'interceptors/api.injector';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShelfComponent } from './components/shelf/shelf.component';
import { ShelfDetailComponent } from './components/shelf-detail/shelf-detail.component';
import { MessagesComponent } from './components/messages/messages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ShelfSearchComponent } from './components/shelf-search/shelf-search.component';
import { BayComponent } from './components/bay/bay.component';
import { BayFormComponent } from './components/bay-form/bay-form.component';
import { BayDetailComponent } from './components/bay-detail/bay-detail.component';
import { BaySearchComponent } from './components/bay-search/bay-search.component';
import { LibRangeSearchComponent } from './components/lib-range-search/lib-range-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { FormCardComponent } from './components/form-card/form-card.component';
import { ShelfFormComponent } from './components/shelf-form/shelf-form.component';
import { LeafletMapComponent } from './components/leaflet-map/leaflet-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FloorComponent } from './components/floor/floor.component';
import { FloorDetailComponent } from './components/floor-detail/floor-detail.component';
import { FloorFormComponent } from './components/floor-form/floor-form.component';
import { FloorLibRangeFormComponent } from './components/floor-lib-range-form/floor-lib-range-form.component';
import { LeafletIframeComponent } from './components/leaflet-iframe/leaflet-iframe.component';
import { LibRangeComponent } from 'components/lib-range/lib-range.component';
import { LibRangeDetailComponent } from 'components/lib-range-detail/lib-range-detail.component';
import { LibRangeFormComponent } from './components/lib-range-form/lib-range-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ShelfComponent,
    ShelfDetailComponent,
    MessagesComponent,
    DashboardComponent,
    ShelfSearchComponent,
    BayComponent,
    BayFormComponent,
    BayDetailComponent,
    BaySearchComponent,
    LibRangeSearchComponent,
    NavigatorComponent,
    FormCardComponent,
    ShelfFormComponent,
    LeafletMapComponent,
    FloorComponent,
    FloorDetailComponent,
    FloorFormComponent,
    FloorLibRangeFormComponent,
    LeafletIframeComponent,
    LibRangeComponent,
    LibRangeDetailComponent,
    LibRangeFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule,
    BrowserAnimationsModule,
    LeafletModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
