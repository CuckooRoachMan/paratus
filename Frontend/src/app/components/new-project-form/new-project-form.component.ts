import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';
import * as alertify from 'alertifyjs';
import Swal from "sweetalert2/dist/sweetalert2.js";
//import { ConfigService } from 'src/app/services/config.service';
//import { Model } from './projectModel';
//import {Validation} from './validations';
//import {MatFormFieldModule} from '@angular/material/form-field';
//import {FormControl} from '@angular/forms';

@Component({
  selector: 'abe-new-project-form',
  templateUrl: './new-project-form.component.html',
  styleUrls: ['./new-project-form.component.scss']
})
export class NewProjectFormComponent implements OnInit {
  proyecto={
    titulo: '',
    descripcion: '',
    visibilidad: 'no',
    presupuesto: 1000,
    timeframe: '',
    roles: 'indefinido',
    herramientas: [],
    fecha_creacion: null
  }

  constructor(
    private authService: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {

  }

  roles = [
    'Diseñador',
    'Desarrolador Senior',
    'Desarrollador Junior',
    'Desarrollador fullstack',
    'Desarrollador frontend',
    'Desarrollador Backend',
    'Desarrolador Android',
    'Desarrolador IOS',
    'Soporte Tecnico',
    'Help Desk',
    'Administrador de Base de datos',
    'Product Owner',
    'Servicio al cliente',
    'Ventas',
  ];
  herramientas = [
    'HTML',
    'CSS',
    'Javascript',
    'PHP',
    'Python',
    'Java',
    'C',
    'C#',
    'C++',
    'R',
    'Swift',
    'Laravel',
    'React',
    'Angular',
    'Ruby on Rails',
    'Django',
    'ASP.NET',
    'Express',
    'Vue',
    'Node',
    'Mysql',
    'Oracle',
    'PostgreSQL',
    'MongoDB',
    'C#',
    'Amazon Web Services',
    'Ingles',
  ];

  timeframes = [
    'Indefinido',
    'Menos de una semana',
    '1 Semana',
    '1 Mes',
    '3 meses',
    '6 meses',
  ];
  //Variables de control de validaciones
  emptyTitulo=false;
  emptyDescripcion=false;
  camposIncompletos=false;
  wrongPresupuesto=false;

  //obtener tiempo
  current= new Date();
  //indice de herramientas
  indexHerramientas=0;


  submitNewProjectForm(){
    if(this.proyecto.titulo==""){
      alertify.error('No puede dejar el titulo en blanco');
    }else if(this.proyecto.descripcion==""){
      alertify.error('No puede dejar la descripcion en blanco');
    }else if(this.proyecto.visibilidad==""){
      alertify.error('No puede dejar la visibilidad en blanco');
    }else if(this.proyecto.presupuesto==0){
      alertify.error('El presupuesto no puede ser cero');
    }else if(this.proyecto.timeframe==""){
      alertify.error('No puede dejar el campo en blanco');
      return false;
    }else{
      this.authService.NewProjectForm(this.proyecto)
      .subscribe(
        res =>{
          if(res.estado=='ProjectSuccess'){
            Swal.fire("Exitoso", "Proyecto guardado con éxito", "success");
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

    /*
    this.validationPresupuesto();
    if (this.proyecto.titulo==="" || this.proyecto.descripcion===""|| this.proyecto.presupuesto===0 ){
      this.camposIncompletos=true;
    }
    else {
      this.proyecto.fecha_creacion=this.current as unknown as string;
      //this.proyecto.herramienta=this.selectedHerramientas;
      this.authService.NewProjectForm(this.proyecto)
      .subscribe(
       res =>{
         console.log(res.estado);
         alert("Projecto publicado exitosamente");
         this.router.navigate(['profile']);

       },
       err =>{
         if (err instanceof HttpErrorResponse) {
           if (err.status === 401) {
           }
         }
       }
     )
    }
  };
  validationPresupuesto(){
    if (this.proyecto.titulo===""){
      this.emptyTitulo=true;
    }
    if (this.proyecto.descripcion===""){
      this.emptyDescripcion=true;
    }
    if (this.proyecto.presupuesto<1000 || this.proyecto.presupuesto>300000 ){
      this.wrongPresupuesto=true;
    }
    if (this.proyecto.presupuesto<1000 || this.proyecto.presupuesto>300000 ){
      this.wrongPresupuesto=true;
    }
  };
  validationTitulo(){
  };*/
/*
  cleanValidations(){
    this.emptyTitulo=false;
    this.emptyDescripcion=false;
    this.camposIncompletos=false;
    this.wrongPresupuesto=false;
    this.emptyPresupesto=false;
  }
*/
  addHerramienta(herramienta){
    this.proyecto.herramientas.push(herramienta);
    this.indexHerramientas=this.herramientas.indexOf(herramienta);
    this.herramientas.splice(this.indexHerramientas,1);
  }
  removeHerramienta(herramienta){
    this.herramientas.push(herramienta);
    this.indexHerramientas=this.proyecto.herramientas.indexOf(herramienta);
    this.proyecto.herramientas.splice(this.indexHerramientas,1);
  }




}
