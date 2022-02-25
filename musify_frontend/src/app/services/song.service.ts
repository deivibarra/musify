import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpHeaders} from '@angular/common/http';
import { GLOBAL } from './global';

import { Song } from '../models/song';


//For Dependency Injection
@Injectable()
export class SongService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addSong(token:any, song:Song){
        let params = JSON.stringify(song);
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.post(this.url + 'song', params, { headers: theheaders});
    }

    getSong(token:any, id:string){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.get(this.url + 'song/'+id, { headers: theheaders});
    }

    getSongs(token:any, albumId=null){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        
        //Trae todos los albums de todos los artistas
        if(albumId == '' || albumId == null){
            return this._http.get(this.url + 'songs/', { headers: theheaders});
        }else{
            //Solo los albums de un artista especifico
            return this._http.get(this.url + 'songs/'+albumId, { headers: theheaders});
        }
    }

    updateAlbum(token:any, id:string, song:Song){
        let params = JSON.stringify(song);
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.put(this.url + 'song/'+id, params, { headers: theheaders});
    }

    deleteSong(token:any, id:string){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.delete(this.url + 'song/'+id, { headers: theheaders});
    }
}