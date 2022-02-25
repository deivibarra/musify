import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';
import {Router, ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //se inyectan todos los servicios que se requieran
  providers: [UserService]
})
export class AppComponent implements OnInit{
  title = 'Musify';
  //Usuario para login
  public user: User;
  //Usuario para el registro
  public user_register: User;

  //Identity es para guardar la info del usuario que se ha logueado
  public identity:any;
  public token:any;
  public errorMessage = null;
  public alertRegister:string = '';
  public url:string;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
    console.log(this.user);

    this._userService.signup(this.user).subscribe(
      (response:any) => {

        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("User does not correctly identified");
        }else{
          //Crear elemento en el localstorage para el identity
          localStorage.setItem('identity', JSON.stringify(identity));

          //Conseguir el token para enviarlo en cada peticion HTTP
          this._userService.signup(this.user,true).subscribe(
            (response:any)=> {
              let token = response.token;
              this.token = token;
              if(this.token.length <= 0){
                alert("Token incorrect");
              }else{

                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              if(error != null){
                this.errorMessage = error.error.message;
                console.log(error);
      
              }
            }
          );

  

        }


      },
      error => {
        if(error != null){
          this.errorMessage = error.error.message;
          console.log(error);

        }
      }
    );

  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity=null;
    this.token=null;
    this._router.navigate(['/']);
  }



  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      (response:any)=>{
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister= "Error during registration";
        }else{
          this.alertRegister= "User created successfully";
          //Para vaciar el formulario de registro
          this.user_register = new User('','','','','','ROLE_USER','');
        }

      },
      error=>{
        if(error != null){
          this.alertRegister = error.error.message;
          console.log(error);
        }
      }
    );
  }
  
}
