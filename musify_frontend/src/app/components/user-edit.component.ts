import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { GLOBAL } from "../services/global";

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

export class UserEditComponent implements OnInit{

    public titulo: string;
    public user:User;
    public identity:any;
    public token:any;
    public alertUpdate:string = '';
    public filesToUpload: Array<File> = [];
    public url:string;

    constructor(
        private _userService: UserService
    ){
        this.titulo = 'Update my profile';

        //LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;

    }
    
    ngOnInit(): void {

        console.log('user-edit.component.ts loaded');
        console.log(this.identity);
    }

    onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            (response:any) =>{
                if(!response.user){
                    this.alertUpdate = "User has not been updated";
                }else{
                    this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.alertUpdate = "User has been updated successfuly";
                    console.log(this.user);

                    if(!this.filesToUpload){
                        //Redirect
                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filesToUpload).then(
                            (result:any) => {
                                console.log(result);
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                
                                //Actualizar la imagen en appcomponent.html
                                let image_path = this.url + '/get-image-user/' + this.user.image;
                                document.getElementById("image-logged")!.setAttribute('src',image_path);

                            },
                            error =>{
                                console.log(error);
                            }
                        );
                    }


                }
            },
            error => {
                if(error != null){
                  this.alertUpdate = error.error.message;
                  console.log(error);
        
                }
              }
        );

      }


      fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
      }

      //Para hacer una peticion Ajax
      makeFileRequest(url:string, params: Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve,reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i=0; i< files.length; i++){
                formData.append('image',files[i],files[i].name);
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status==200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }   
                }
            }

            xhr.open('POST',url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
      }

}
