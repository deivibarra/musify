import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Token } from '@angular/compiler/src/ml_parser/tokens';

//For Dependency Injection
@Injectable()
export class AlbumService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getAlbums(token:any, artistId=null){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        
        //Trae todos los albums de todos los artistas
        if(artistId == '' || artistId == null){
            return this._http.get(this.url + 'albums/', { headers: theheaders});
        }else{
            //Solo los albums de un artista especifico
            return this._http.get(this.url + 'albums/'+artistId, { headers: theheaders});
        }
    }

    getAlbum(token:any, id:string){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.get(this.url + 'album/'+id, { headers: theheaders});
    }

    addAlbum(token:any, album:Album){
        let params = JSON.stringify(album);
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.post(this.url + 'album', params, { headers: theheaders});
    }

    updateAlbum(token:any, id:string, album:Album){
        let params = JSON.stringify(album);
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.put(this.url + 'album/'+id, params, { headers: theheaders});
    }

    deleteAlbum(token:any, id:string){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.delete(this.url + 'album/'+id, { headers: theheaders});
    }
}