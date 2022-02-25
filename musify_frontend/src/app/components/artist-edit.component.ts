import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";

import { GLOBAL } from "../services/global";
import { UserService } from "../services/user.service";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artist.service";
import { UploadService } from "../services/upload.service";

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-edit.html',
    providers:[UserService,ArtistService,UploadService]
})

export class ArtistEditComponent implements OnInit{

    public titulo:string;
    public artist: Artist;
    public identity;
    public token;
    public url:string;
    public alertEditArtist:string = '';
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService

    ){
        this.titulo= 'Edit artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
    }

    ngOnInit(): void {
        console.log('artist-add.component.ts loaded');
        this.getArtist();

    }

    onSubmit(){
        console.log(this.artist);

        this._route.params.forEach((params:Params)=>{
            let id= params['id'];

            this._artistService.updateArtist(this.token, id, this.artist).subscribe(
                (response:any)=>{
                    if(!response.artist){
                        this.alertEditArtist = "Server Error";
                    }else{
                        this.alertEditArtist = "Artist has been updated successfully";

                        //Subir la imagen del artista
                        if(!this.filesToUpload || this.filesToUpload.length == 0){
                            this._router.navigate(['/detail-artist',id]);
                        }else{
                            this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id,[],this.filesToUpload, this.token, 'image').then(
                                (result)=> {
                                    this._router.navigate(['/detail-artist',id]);
                                },
                                (error)=>{
                                }
                            );
                        }
                    }
                },
                error=>{
                    if(error != null){
                      this.alertEditArtist = error.error.message;
                      console.log(error);
                    }
                  }
            );
        });


    }

    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
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
                        this.titulo = this.artist.name;
                    }
                },
                error=>{
                    if(error != null){
                      this.alertEditArtist = error.error.message;
                      console.log(error);
                    }
                  }                
            );
        });
      }
}