import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

import { Router } from "@angular/router";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: 'abe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required ]),
    password: new FormControl('', [Validators.required, Validators.min(3) ])
  });
  hide = true;
  get emailInput() { return this.signin.get('email'); }
  get passwordInput() { return this.signin.get('password'); }

  user={
    email:'',
    password:''
  }

  constructor(
    private authservice:AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    /*if(this.authservice.loggedIn()){
      this.router.navigate(['/profile'])
    }*/
  }

  signIn(){
    this.user.email=this.signin.value.email;
    this.user.password=this.signin.value.password;
    this.authservice.signIn(this.user)
    .subscribe(
      res =>{ 
        //manejo de respuestas para login de usuario
        if(res.estado=='email'){
          Swal.fire("Error", "Su correo no esta registrado", "warning");     
        }else if(res.estado=='password'&&res.type=='usuario'){
          Swal.fire("Error", "Correo o contraseña incorrectos", "warning");
        }else if(res.estado=='temporal'&&res.type=='usuario'){
          localStorage.setItem('token', res.token);
          Swal.fire("Bienvenido", "Ahora puede cambiar su contraseña", "success");
          this.router.navigate(['/recover-password']);
        }else if(res.estado=='hecho'&& res.type=='usuario'){
          localStorage.setItem('token', res.token);
          Swal.fire("Bienvenido","", "success");
          this.router.navigate(['/profile']);
        }     
        //usuario profesional
        else if(res.estado=='hecho'&& res.type=='dev'){
          localStorage.setItem('dev', res.token);
          Swal.fire("Bienvenido","", "success");
          this.router.navigate(['/profile-dev']);
          }else if(res.estado=='password'&&res.type=='dev'){
            Swal.fire("Error", "Correo o contraseña incorrectos", "warning");
          }else if(res.estado=='inactivo'&& res.type=='dev'){
            Swal.fire("Inactivo", "Su usuario esta inactivo, debe activarlo para ingresar", "warning");
            this.router.navigate(['/verification']);
          }else if(res.estado=='temporal'&&res.type=='dev'){
            localStorage.setItem('token', res.token);
            Swal.fire("Bienvenido", "Ahora puede cambiar su contraseña", "success");
            this.router.navigate(['/recover-password']); 
          }else{
          Swal.fire("Error", "No se pudo encontrar su cuenta, intente de nuevo y verifique los datos ingresados", "warning");
        }   
      },
      err =>{
        Swal.fire("Error", "Hubo un error en el sistema intente de nuevo", "warning");
        
      }
    )
  }

}
