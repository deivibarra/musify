import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';


//.pipe(map(res=> res.json()));

//For Dependency Injection
@Injectable()
export class UserService{
    
    public identity:any;
    public token:any;
    public url: string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    signup(user_to_login: any, gethash = false){

        if(gethash){
            user_to_login.gethash = gethash;
        }
 
        let params = JSON.stringify(user_to_login);
        let theheaders = new HttpHeaders();
        theheaders = theheaders.set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, { headers: theheaders});
    }

    register(user_to_register: any){
        
        let params = JSON.stringify(user_to_register);
        let theheaders = new HttpHeaders();
        theheaders = theheaders.set('Content-Type', 'application/json');

        return this._http.post(this.url + 'register', params, { headers: theheaders});      
    }

    updateUser(user_to_update:any){
        let params = JSON.stringify(user_to_update);
        let theheaders = new HttpHeaders();
        theheaders = theheaders.set('Content-Type', 'application/json').set('Authorization',this.getToken());

        return this._http.put(this.url + 'update-user/'+user_to_update._id, params, { headers: theheaders});      
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity')!);
        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

}