import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers:[UserService, ArtistService]
})

export class ArtistListComponent implements OnInit{

    public titulo:string;
    public artists: Artist[] = [];
    public identity;
    public token;
    public url:string;
    public next_page;
    public prev_page;
    public alertArtist:string = '';
    public confirmado:string = '';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo= 'Artists';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit(): void {
        console.log('artist-list.component.ts loaded');
        //Cargar listado de artista
        this.getArtists();
    }

    getArtists(){
        this._route.params.forEach((params:Params)=>{
            //=params es para convertirlo a numerico el parametro
            let page = +params['page'];
            if(!page){
                page = 1;
            }else{
                this.next_page = page+1;
                this.prev_page = page-1;

                if(this.prev_page == 0){
                    this.prev_page = 1;
                }
            }

            this._artistService.getArtists(this.token,page).subscribe(
                (response:any)=>{
                    if(!response.artists){
                        this._router.navigate(['/']);
                    }else{
                        this.artists = response.artists;
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

    onCancelArtist(){
        this.confirmado='';
    }

    onDeleteArtist(id:string){
        this._artistService.deleteArtist(this.token,id).subscribe(
            (response:any)=>{
                if(!response.artist){
                    alert('Server Error')
                }else{
                    this.getArtists();
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