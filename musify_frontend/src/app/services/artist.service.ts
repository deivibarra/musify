import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';


//.pipe(map(res=> res.json()));

//For Dependency Injection
@Injectable()
export class ArtistService{

    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getArtists(token:any, page:number){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.get(this.url + 'artists/'+page, { headers: theheaders});
    }

    getArtist(token:any, id:string){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.get(this.url + 'artist/'+id, { headers: theheaders});
    }

    addArtist(token:any, artist:Artist){
        let params = JSON.stringify(artist);
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.post(this.url + 'artist', params, { headers: theheaders});
    }

    updateArtist(token:any, id:string, artist:Artist){
        let params = JSON.stringify(artist);
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.put(this.url + 'artist/'+id, params, { headers: theheaders});
    }

    deleteArtist(token:any, id:string){
        let theheaders = new HttpHeaders();
        
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',token);
        return this._http.delete(this.url + 'artist/'+id, { headers: theheaders});
    }
}