import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfComponent } from 'components/shelf/shelf.component';
import { DashboardComponent } from 'components/dashboard/dashboard.component';
import { ShelfDetailComponent } from 'components/shelf-detail/shelf-detail.component';
import { BayComponent } from 'components/bay/bay.component';
import { BayDetailComponent } from 'components/bay-detail/bay-detail.component';
import { FloorComponent } from 'components/floor/floor.component';
import { FloorDetailComponent } from 'components/floor-detail/floor-detail.component';
import { LeafletIframeComponent } from 'components/leaflet-iframe/leaflet-iframe.component';
import { LibRangeComponent } from 'components/lib-range/lib-range.component';
import { LibRangeDetailComponent } from 'components/lib-range-detail/lib-range-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'shelves', component: ShelfComponent },
  { path: 'shelves/:id', component: ShelfDetailComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'bays', component: BayComponent},
  { path: 'bays/:id', component: BayDetailComponent},
  { path: 'floors', component: FloorComponent},
  { path: 'floors/:id', component: FloorDetailComponent},
  { path: 'libranges', component: LibRangeComponent},
  { path: 'libranges/:id', component: LibRangeDetailComponent},
  { path: 'map', component: LeafletIframeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
