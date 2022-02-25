import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers:[UserService,ArtistService,AlbumService]
})

export class ArtistDetailComponent implements OnInit{
    public artist: Artist;
    public identity;
    public token;
    public url:string;
    public alertArtist:string = '';
    public albums:Album[] = [];
    public confirmado:string = '';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService:AlbumService

    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
    }

    ngOnInit(): void {
        console.log('artist-detail.component.ts loaded');
        this.getArtist();

    }

      getArtist(){
        //Recogemos el id que nos llega por la url y consultamos el artista
        this._route.params.forEach((params:Params)=>{
            let id= params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                (response:any)=>{
                    if(!response.artist){
                        this._router.navigate(['/']);
                    }else{
                        this.artist = response.artist;
                        //Sacar los albums del artista
                        this._albumService.getAlbums(this.token,response.artist._id).subscribe(
                            (response:any)=>{
                                if(!response.albums || response.albums.length == 0){
                                    this.alertArtist = "Artist without albums";
                                }else{
                                    this.albums = response.albums;
                                    console.log(this.albums);
                                }
                            },
                            error=>{
                                if(error != null){
                                  this.alertArtist = error.error.message;
                                  console.log(error);
                                }
                              }  
                        );

                    }
                },
                error=>{
                    if(error != null){
                      this.alertArtist = error.error.message;
                      console.log(error);
                    }
                  }                
            );
        });
      }

      onDeleteConfirm(id:string){
        this.confirmado = id;
    }

    onCancelAlbum(){
        this.confirmado='';
    }

    onDeleteAlbum(id:string){
        this._albumService.deleteAlbum(this.token,id).subscribe(
            (response:any)=>{
                if(!response.album){
                    alert('Server Error')
                }else{
                    this.getArtist();
                }
            },
            error=>{
                if(error != null){
                  this.alertArtist = error.error.message;
                  console.log(error);
                }
              }
        );
    }


}