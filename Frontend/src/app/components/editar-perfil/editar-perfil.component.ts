import { Component, OnInit} from '@angular/core';
import {  AuthService} from "../../services/auth.service";
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable } from "rxjs";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {SidebarComponent} from 'src/app/components/sidebar/sidebar.component';
//para redireccionar
import { Router } from "@angular/router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { DatePipe } from '@angular/common';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'abe-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss'],
  providers: [DatePipe]
})
export class EditarPerfilComponent implements OnInit {
  changePassw: FormGroup = new FormGroup({
    contrasenaActual: new FormControl('', [ Validators.required ]),
    contrasenaNueva1: new FormControl('', [Validators.required, Validators.min(8) ]),
    contrasenaNueva2: new FormControl('', [Validators.required, Validators.min(8) ]),
  });s
  hide = true;
  hide2=true;
  hide3=true;
  get contrasenaActualInput() { return this.changePassw.get('contrasenaActual'); }
  get contrasenaNueva1Input() { return this.changePassw.get('contrasenaNueva1'); }
  get contrasenaNueva2Input() { return this.changePassw.get('contrasenaNueva2'); }

  selectedFile: File = null;
  fd = new FormData();
  public imagePath;
  imgURL: any;
  url:any;
  newURL;
  public message: string;
  uploadForm: FormGroup;

  profile={
    nombre:'',
    username: '',
    email:'',
    contrasenaActual:'',
    contrasenaNueva1:'',
    contrasenaNueva2:'',
    telefono:'',
    picPerfil:'',
  }
  template='';
  validate=true;

  constructor(
    public authService: AuthService, private miDatePipe: DatePipe,
    private router: Router,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.uploadForm = this.formBuilder.group({
      avatar: [null]
    });
   }

   verify(){
    var pass= this.changePassw.value.contrasenaNueva1;
    if(pass.length<8){
      this.template='<div class="alert alert-warning" role="alert"><div>La contraseña debe tener al menos 8 caracteres.</div></div>';
      this.validate=false;
    }else if(!pass.match(/[0-9]/)){
      this.template='<div class="alert alert-warning" role="alert"><div>Debe incluir al menos un número en su contraseña.</div></div>';
      this.validate=false;
    }else if(!pass.match(/[A-Z]/)){
      this.template='<div class="alert alert-warning" role="alert"><div>Debe incluir al menos una mayúscula en su contraseña.</div></div>';
      this.validate=false;
    }else if(!pass.match(/[a-z]/)){
      this.template='<div class="alert alert-warning" role="alert"><div>Debe incluir al menos una minúscula en su contraseña.</div></div>';
      this.validate=false;
    }else if(!pass.match(/[_\/\*\$.\\\[\]\(\):;º!·&,\?!@#¬'+\{\}`^¨]/)){
      this.template='<div class="alert alert-warning" role="alert"><div>Debe incluir al menos un caracter NO alfa-numérico en su contraseña.</div></div>';
      this.validate=false;
    }else{
      this.template='';
      this.validate=true;
    }
  }

  ngOnInit(){
    if(!this.authService.loggedIn()){
      this.router.navigate(['/home'])
    }
    this.authService.getProfile()
    .subscribe(
      res => {
        this.profile=res.User;
        let currDate = new Date();
       this.getImage().subscribe(x => this.imgURL = x)
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/signin']);
          }
        }
      }
    )
  }

  createFormData(event) {
    //this.selectedFile=null;
    this.fd=new FormData();
    this.selectedFile = <File>event.target.files[0];
    let fileName=this.selectedFile.name.split(".").pop();
    /*if(fileName!="jpeg"){
        alert('No es jpeg');
        this.fd=null;
        return false;
    }*/
    this.fd.append('file', this.selectedFile, this.selectedFile.name);
    this.showPreview(event);
  }

  // Imagen Preview
 showPreview(event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.uploadForm.patchValue({
  avatar: file
  });
  this.uploadForm.get('avatar').updateValueAndValidity()
  // File Preview
  const reader = new FileReader();
  reader.onload = () => {
  this.imgURL = reader.result as string;
  this.newURL=this.imgURL;
  }
  reader.readAsDataURL(file)
  }

  imgURLtest="https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png";
  warningMessage='Algunos campos presentan errores';
  newPassword='';
  newPasswordCheck='';
  passwordCheck=false;

    //
  actualizarPerfil(){
    Swal.fire({
      title: "Seguro que quieres actualizar tus cuenta?",
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Continuar',
      denyButtonText: 'Cancelar',
    })
    .then((Delete)=>{
      if(Delete.isConfirmed){
    this.authService.editProfile(this.profile)
    .subscribe(
      res =>{
        if(res.estado=='Hecho'){
          Swal.fire("Datos Actualizados", "Gracias por mantener actualizados su información", "success");
          this.router.navigate(['/profile']);
        }else if(res.estado=='Fallo'){
          Swal.fire("Error", "No se pudieron actualizar sus datos", "warning");
        }
        
      },
      err =>{
        Swal.fire("Error", "Hubo un error en el sistema, favor intente de nuevo!", "warning");
        
      }
    )
      }
    })
  }


      //funcion del boton para subir imagen
  goSubirImagen(){
      //programacion para subir imagen
      if(this.fd==null){
        alert('Debe ingresar un archivo');
      }else{
      this.authService.uploadProfile(this.fd,this.profile.email)
      .subscribe( res => {
        if(res.estado=='Hecho'){
        Swal.fire("Exitoso", "Imagen guardada con éxito", "success");
        location.reload();
        }else{
          Swal.fire("Fallido", "La imagen no se logró subir", "warning");
        }
      },
      err=>{
        ///console.log (error)
        alert('Error');
        location.reload();
      });

      }     
  }

  getImage(): Observable<SafeResourceUrl> {
    return  this.authService.getProfilePic();
  }

  changePass(){
    if(this.validate==false){
      alertify.error('Verifique todos los campos ingresados');
      return false;
    }
    this.profile.contrasenaNueva1 = this.changePassw.value.contrasenaNueva1;
    if(this.profile.contrasenaNueva1 ==""){
      this.template='<div class="alert alert-warning" role="alert"><div>No puede dejar la contraseña en blanco.</div></div>';
      return false;
    }
    Swal.fire({
      title: "Seguro que quiere cambiar su contraseña?",
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Continuar',
      denyButtonText: 'Cancelar',
    })
    .then((Delete)=>{
      if(Delete.isConfirmed){
        this.profile.contrasenaActual=this.changePassw.value.contrasenaActual;
        this.profile.contrasenaNueva1=this.changePassw.value.contrasenaNueva1;
        this.profile.contrasenaNueva2=this.changePassw.value.contrasenaNueva2;
        this.authService.changePassword(this.profile)
    .subscribe(
      res =>{ 
        if(res.estado=='actual'){
          Swal.fire("Error", "Contraseña Actual Errónea", "warning");
        }else if(res.estado=='password'){
          Swal.fire("Error", "No se pudo confirmar la nueva contraseña, verifique que ambos campos sean iguales", "warning");
        }else if(res.estado=='hecho'){
          Swal.fire("Completado", "Su contraseña fue actualizada con éxito", "success");
          this.router.navigate(['/profile']);
  
        }else if(res.estado=='inactivo'){
          Swal.fire("Su usuario no está activado", "", "warning");
          this.router.navigate(['/verificacion']);
  
        }else{
        Swal.fire("Error","Hubo un error, favor intente de nuevo", "error");
        }        
      },
      err =>{
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/signin']);
          }
        }
        //this.router.navigate(['/signin']);
        Swal.fire("Error", "Hubo un error en el sistema intente de nuevo", "error");
      }
    )
  
      }
    })
  

  }


}
