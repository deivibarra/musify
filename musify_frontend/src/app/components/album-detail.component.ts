import { Component, OnInit } from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { GLOBAL } from "../services/global";

//Services
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artist.service";
import { AlbumService } from "../services/album.service";
import { SongService } from "../services/song.service";

//Models
import { Artist } from "../models/artist";
import { Song } from "../models/song";
import { Album } from "../models/album";

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers:[UserService,ArtistService,AlbumService,SongService]
})

export class AlbumDetailComponent implements OnInit{
    public artist: Artist;
    public songs: Song[]=[];
    public identity;
    public token;
    public url:string;
    public alertAlbum:string = '';
    public album:Album;
    public confirm_to_delete:string = '';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService:AlbumService,
        private _songService:SongService

    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','','');
        this.album = new Album('','','',0,'','');
    }

    ngOnInit(): void {
        console.log('artist-detail.component.ts loaded');
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params:Params)=>{
            let album_id = params['id'];

            this._albumService.getAlbum(this.token,album_id).subscribe(
                (response:any)=>{
                    if(!response.album){
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
                        this.artist = response.album.artist;
                        
                        //Obtener las canciones del album
                        this._songService.getSongs(this.token,response.album._id).subscribe(
                            (response:any)=>{
                                if(!response.songs || response.songs.length ==0){
                                    this.alertAlbum = "Album without songs";
                                }else{
                                    this.songs = response.songs;
                                    console.log(this.songs);
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
                },
                error=>{
                    if(error != null){
                      this.alertAlbum = error.error.message;
                      console.log(error);
                    }
                  }                
            );
        });
    }

    onDeleteConfirm(id:string){
        this.confirm_to_delete = id;
    }

    onCancelDelete(){
        this.confirm_to_delete = '';
    }


    onDeleteSong(id:string){
        this._songService.deleteSong(this.token,id).subscribe(
            (response:any)=>{
                if(!response.song){
                    alert('Server Error');
                }else{
                    this.getAlbum();
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

    startPlayer(song:Song){
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'get-song-file/'+song.file;
        let image_path = this.url + 'get-image-album/'+ this.album.image;

        localStorage.setItem('sound_song',song_player);
        document.getElementById("mp3-source")?.setAttribute("src",file_path);
        (document.getElementById("player") as any).load();
        (document.getElementById("player") as any).play();

        document.getElementById('play-song-title')!.innerHTML = song.name;
        document.getElementById('play-song-artist')!.innerHTML = this.artist.name;
        document.getElementById('play-image-album')!.setAttribute('src',image_path);

    }

}