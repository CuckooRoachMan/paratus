import { Component,Input, OnInit } from '@angular/core';
import { ProyectCommentsEditorComponent } from '../proyect-comments-editor/proyect-comments-editor.component';
import {AuthService} from '../../../services/auth.service';
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'abe-proyect-comments',
  templateUrl: './proyect-comments.component.html',
  styleUrls: ['./proyect-comments.component.scss']
})

export class ProyectCommentsComponent implements OnInit {

  @Input() idComentario:string; //identificador para comentarios

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  comentarioPrevio=[];  //arreglo donde guardamos los comentarios del backend

  fechas=[];  //arreglo donde guardamos los comentarios del backend


  objIdUsario={  //objeto para hacer post con el id_usario
    id_usuario:''
  };

  imagenesPerfil=[]; //arrelgo donde guardaos las imagenes de perfil

  id_proyecto={     //objeto para poder recibir el objeto de comentarios
      id:''
  }
  
  imgURL: any;
  ngOnInit(): void {
    this.id_proyecto.id=this.idComentario;
    this.authService.getComments(this.id_proyecto)
    .subscribe(
      res=>{
        for(let obj of res.comment.reverse()){
          this.comentarioPrevio.push(obj);
          this.objIdUsario=obj;
          this.getImageComments(this.objIdUsario).subscribe(x => {this.imgURL = x; this.imagenesPerfil.push(x); })
          //this.imagenesPerfil.push(this.imgURL);
          console.log("imagenes de perfil");
          console.log(this.imagenesPerfil);
        }
        this.formatoFecha();
      },
        err=>{console.log('error al mostrar proyectos',err)}
    );
  }


  addComentario(comentario) {
    this.comentarioPrevio.unshift( { nombre: comentario.nombre , cuerpo: comentario.cuerpo, fecha_creacion: "Justo Ahora"})
    this.fechas.unshift("Justo Ahora");
  }

  addImg(img){
    this.imagenesPerfil.unshift(img);
  }

  formatoFecha(){
    for(let obj of this.comentarioPrevio){
      var year = obj.fecha_creacion.substring(0,4) //months from 1-12
      var month = obj.fecha_creacion.substring(5,7);
      var timeframe = obj.fecha_creacion.substring(11,16);
      this.fechas.push(month+'/'+year+" "+timeframe)
    }

  }

  getImageComments(userId): Observable<SafeResourceUrl> {
    return  this.authService.getProfilePicComments(userId);
  }


}
