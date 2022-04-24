import { Component, OnInit } from '@angular/core';
import {  AuthService} from "../../services/auth.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {SidebarComponent} from 'src/app/components/sidebar/sidebar.component';
//para redireccionar
import { Router } from "@angular/router";
import Sawl from "sweetalert2/dist/sweetalert2.js";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'abe-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit {

  imgURL: any;
  profile={
    //picPerfil:'',
    nombre:'',
    username: '',
    email:'',
    telefono:''
  }

  constructor(
    public authService: AuthService, private miDatePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(){
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

  goEditarPerfil(){
    this.router.navigate(['/edit-profile']);
  }

  getImage(): Observable<SafeResourceUrl> {
    return  this.authService.getProfilePic();
  }


}
