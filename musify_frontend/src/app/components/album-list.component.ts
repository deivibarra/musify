import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";
import { Album } from "../models/album";
import { AlbumService } from "../services/album.service";

@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers:[UserService,ArtistService,AlbumService]
})

export class AlbumListComponent implements OnInit{
    public titulo:string;
    public identity;
    public token;
    public url:string;
    public alertAlbum:string = '';
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

        this.titulo = "Albums";
    }

    ngOnInit(): void {
        console.log('album-list.component.ts loaded');
        this.getAlbums();

    }

    getAlbums(){
        this._albumService.getAlbums(this.token,null).subscribe(
            (response:any)=>{
                if(!response.albums || response.albums.length == 0){
                    this.alertAlbum = "Not found Albums";
                }else{
                    this.albums = response.albums;
                    console.log(this.albums);
                }
            },
            error=>{
                if(error != null){
                  this.alertAlbum = error.error.message;
                  console.log(error);
                }
              }  
        );
    }
}