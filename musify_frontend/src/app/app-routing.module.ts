import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Import Home
import { HomeComponent } from './components/home.component';

//Import user
import { UserEditComponent } from "./components/user-edit.component";

//Import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//Import album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';

//Song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';


const routes: Routes = [
  //Ruta por default
  
  /*Codigo para redireccionar por si lo necesitamos
  {
    path: '',
    redirectTo: 'artists/1',
    pathMatch: 'full'
  },*/

  {path: '', component:HomeComponent},
  //Rutas de views
  {path: 'artists/:page', component:ArtistListComponent},
  {path: 'add-artist', component:ArtistAddComponent},
  {path: 'edit-artist/:id', component:ArtistEditComponent},
  {path: 'detail-artist/:id', component:ArtistDetailComponent},
  {path: 'my-account', component:UserEditComponent},
  {path: 'add-album/:artist', component:AlbumAddComponent},
  {path: 'edit-album/:id', component:AlbumEditComponent},
  {path: 'detail-album/:id', component:AlbumDetailComponent},
  {path: 'albums', component:AlbumListComponent},
  {path: 'add-song/:album', component:SongAddComponent},
  {path: 'edit-song/:id', component:SongEditComponent},
  //Ruta cuando no encuentre nada
  {path: '**', component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }