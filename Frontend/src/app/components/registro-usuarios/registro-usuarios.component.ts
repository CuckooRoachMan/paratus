import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//inicializando servicio para autenticar
import { AuthService } from "../../services/auth.service";
//para redireccionar
import { Router } from "@angular/router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as alertify from 'alertifyjs';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'abe-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.scss']
})
export class RegistroUsuariosComponent implements OnInit {
  signup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ]),
    vpassword: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide = true;
  hide2= true;
  get emailInput() { return this.signup.get('email'); }
  get passwordInput() { return this.signup.get('password'); }
  get vpasswordInput() { return this.signup.get('vpassword'); }

  anio:Number;
  user={
    nombre: '',
    username: '',
    email: '',
    password: '',
    vpassword: '',
    telefono: '',
    genero: ''
  };

  template='';
  validate=true;
  correo = EmailValidator.validate(this.user.email);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    let date = new Date();
    this.anio=date.getFullYear(); 
  }

  ngOnInit(): void {
  }

  verify(){
    var pass= this.signup.value.password;
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
    }else if(!pass.match(/[_\/\*\$.\\\[\]\(\):;,\?!@#¬'%.$?¡¿+\{\}`^¨]/)){
      this.template='<div class="alert alert-warning" role="alert"><div>Debe incluir al menos un caracter NO alfa-numérico en su contraseña.</div></div>';
      this.validate=false;
    }else{
      this.template='';
      this.validate=true;
    }
  }


  signUp(){if(this.validate==false){
    alertify.error('Verifique todos los campos ingresados');
    return false;
  }
  /*if (this.correo==false){
    alertify.error("Error", "El correo no es válido", "warning");
    return false;
  }*/
  this.user.password = this.signup.value.password;
  if(this.user.password==""){
    this.template='<div class="alert alert-warning" role="alert"><div>No puede dejar la contraseña en blanco.</div></div>';
    return false;
  }
  this.user.vpassword = this.signup.value.vpassword;
  if(this.user.nombre==""){
    alertify.error('No puede dejar el nombre en blanco');
  }else if(this.user.username==""){
    alertify.error('No puede dejar el nombre de usuario en blanco');
  }else if(this.user.email==""){
    alertify.error('No puede dejar el correo en blanco');
  }else if(this.user.password==""){
    alertify.error('No puede dejar la contraseña en blanco');
  }else if(this.user.vpassword==""){
    alertify.error('Se requiere verificación de su contraseña');
  }else if(!this.user.nombre.match(/^[a-zA-Z| ]+$/)){
    alertify.error('El nombre sólo debe incluir letras');
  /*}else if(!this.user.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/)){
    alertify.error('El correo debe tener formato válido');*/
  }else if(!this.user.telefono.match(/^[0-9]+$/)){
    alertify.error('El número de télefono sólo debe incluir números');
    return false;
  }else{
    this.authService.signUp(this.user)
    .subscribe(
      res =>{
        if(res.estado=='usuario_repetido'){
          alertify.error("Error", "Nombre de Usuario repetido", "warning");
          return false;
        }else if(res.estado=='correo_repetido'){
          alertify.error("Error", "Correo repetido", "warning");
          return false;
        }else if(res.estado=='password'){
          alertify.error("Error", "Los campos de contraseña no coinciden", "warning");
          return false;
        }else if(res.estado=='hecho'){
          localStorage.setItem('token', res.token);
          Swal.fire("Registro Exitoso", "Bienvenido a Paratus, ahora ya puedes crear tus  proyectos y conocer profesionales que harán tu idea una realidad", "success");
          this.router.navigate(['/profile']);
        }else{
          Swal.fire("Error", "Hubo un error en los datos ingresados, verifique cada uno de ellos!", "warning");
        }
        
      },
      err =>{
        console.log(err);
        Swal.fire("Error", "Hubo un error en el sistema, favor intente de nuevo!", "error");
        this.router.navigate(['/signup']);
      }
    )
  }

  
}


}
