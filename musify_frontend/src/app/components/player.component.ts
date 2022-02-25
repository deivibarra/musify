import { Component, OnInit } from "@angular/core";
import { GLOBAL } from "../services/global";

//models
import { Song } from "../models/song";
import { Album } from "../models/album";
import { Artist } from "../models/artist";

@Component({
    selector: 'player',
    template: `
        <div class="album-image">
            <span *ngIf="song.album">
                <img id="play-image-album" src="{{url+'get-image-album/'+album.image}}"/>
            </span>

            <span *ngIf="!song.album">
                <img id="play-image-album" src="assets/images/default.jpg"/>
            </span>
        </div>

        <div class="audio-file">
            <p>  Listen Now </p>
            <p>
                <span id="play-song-title">  Cancion{{song.name}}</span>
                |
                <span id="play-song-artist" *ngIf="artist">  Artista {{artist.name}}</span>
            </p>
            <p>
                <audio controls id="player">
                    <source id="mp3-source" src="{{url+'get-song-file/'+song.file}}" type="audio/mpeg">
                    Your browser does not support the audio tag. 
                </audio>
            </p>
            
        </div>
    
    
    `
})

export class PlayerComponent implements OnInit{
    public url:string;
    public song:Song;
    public album;
    public artist;

    constructor(){
        this.url = GLOBAL.url;
        this.song = new Song('',0,'','','','');
        this.album = new Album('','','',0,'','');
        this.artist = new Artist('','','','');
    }

    ngOnInit(): void {
        console.log("player loaded");

        var song = JSON.parse(localStorage.getItem('sound_song')!);
        if(song){
            this.song   = song;
            this.album  = song.album;
            this.artist = song.album.artist;
        }else{
            this.song = new Song('',0,'','','','');
        }

    }
}