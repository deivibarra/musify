import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers:[UserService,ArtistService]
})

export class ArtistAddComponent implements OnInit{

    public titulo:string;
    public artist: Artist;
    public identity;
    public token;
    public url:string;
    public alertAddArtist:string = '';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo= 'Add new artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
    }

    ngOnInit(): void {
        console.log('artist-add.component.ts loaded');

    }

    onSubmit(){
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            (response:any)=>{
                if(!response.artist){
                    this.alertAddArtist = "Server Error";
                }else{
                    this.alertAddArtist = "Artist has been created successfully";
                    this.artist = response.artist;
                    this._router.navigate(['/edit-artist',response.artist._id]);
                }
            },
            error=>{
                if(error != null){
                  this.alertAddArtist = error.error.message;
                  console.log(error);
                }
              }
        );
    }

}