import { Component, OnInit } from '@angular/core';
import {  AuthService} from "../../services/auth.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
//para redireccionar
import { Router } from "@angular/router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'abe-profile-dev',
  templateUrl: './profile-dev.component.html',
  styleUrls: ['./profile-dev.component.scss'],
  providers: [DatePipe]
})
export class ProfileDevComponent implements OnInit {

  imgURL: any;
  profile={
    //picPerfil:'',
    nombre:'',
    username: '',
    email:'',
    profesion: '',
    tecnologias: '',
    experiencia: '',
    telefono:''
  }

  constructor(
    public authService: AuthService, private miDatePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(){
    if(this.authService.loggedIn()){
      this.router.navigate(['/profile']);
    }else{
      
    this.authService.userState()
    .subscribe(
      res => {
        if(res.estado=='inactivo'){
          this.router.navigate(['/verification']);
          Swal.fire("Error", "Su cuenta debe estar activa para usar Jalón Universitario", "warning");
        }else{
          this.authService.getProfileDev()
          .subscribe(
            res => {
              this.profile=res.User;
             this.getImage().subscribe(x => {this.imgURL = x})        
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
  }

  goEditarPerfil(){
    this.router.navigate(['/edit-profile-dev']);
  }

  getImage(): Observable<SafeResourceUrl> {
    return  this.authService.getProfilePicDev();
  }

}
