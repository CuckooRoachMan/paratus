import { formatDate } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent} from 'angular-bootstrap-md';
import {AuthService} from '../../services/auth.service';
import { Router } from "@angular/router";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Observable } from "rxjs";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'abe-search-prof',
  templateUrl: './search-prof.component.html',
  styleUrls: ['./search-prof.component.scss']
})
export class SearchProfComponent implements OnInit {
//Childs necesarios para usar el ngAfterViewInit (para la paginacion)
@ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
@ViewChild(MdbTableDirective, {static: true}) mdbTable:MdbTableDirective;

//elementos a mostrar en la tabla del html
  elements: any = [];
//indice correspondiente del array elements
idElement:any;
//Arreglo de cabeceras de la tabla
  headElements = ['Nombre', 'Correo', 'Profesión', 'Tecnologías', 'Experiencia'];
//variable para la busqueda
  searchText: string = '';
//variable para el Datasource de la tabla
  previous: string;
/* variable para la cantidad de documentos de la base y asi saber el tamaño
  que tendra el arreglo elements*/
  docs:number;
//Arreglo para almacenar los datos recibidos de la consulta a la base
  professionals:any=[];
  profesional={
    correo:''
  }

//modal
closeResult = '';

imgURL: any;

constructor(
  private modalService: NgbModal,
  private cdRef: ChangeDetectorRef,
  private authService: AuthService,
  private router: Router) { }

//Listener para hacer la busqueda dinamica que no requiera un boton
@HostListener('input') oninput() {
  this.searchItems();
}

ngOnInit() {
if(!this.authService.loggedIn()){
  this.router.navigate(['/signin']);
}else {

/*Llamado a la funcion que trae la consulta del backend, lleva un parametro (this.elements)
  porque en el servicio "auth" deje la funcion como si fuese post, en realidad deberia ser
  get y no deberia llevar ningun parametro asi que no se sorprendan por ver eso ahi*/
this.authService.searchProf()
.subscribe(
  res=>{
    //Guardando el numero de elementos de la consulta hecha
    this.professionals=res;
    this.docs=this.professionals.Professional;
    //console.log(this.docs);
    //Guardando todos los elementos de la consulta hecha en profeessionals
    this.professionals=this.professionals.profesional;
    //console.log('muestra los proyectos',this.professionals);
    //Llamado a la funcion que llena los elementos a mostrar en la tabla
    this.fillItems(this.docs);
    //relacionado con la obtencion de la imagen de usuario
    this.getImage().subscribe(x => {this.imgURL = x})
  },
  err=>{console.log(err)}
);
}

}

fillItems(limit:number){
for (let i = 0; i < limit; i++) {
  /*Llenando el arreglo de elementos, para agregar mas datos solo deben incluir una nueva linea
    Con la forma: nombreIndice: this.developer[i].campoDeLaConsulta, tambien recuerden agregar un
    valor a headElements para el encabezado de cada columna que agreguen*/
  this.elements.push({
    ID:i.toString(),
    Nombre: this.professionals[i].nombre,
    //Apellido: this.professionals[i].apellido,
    Correo: this.professionals[i].email,
    Profesion: this.professionals[i].profesion,
    Tecnologias: this.professionals[i].tecnologias,
    Experiencia: this.professionals[i].experiencia,
    Telefono: this.professionals[i].telefono,
    PicPerfil: this.professionals[i].picPerfil,
    NombreUsuario: this.professionals[i].username
  });
}
this.mdbTable.setDataSource(this.elements);
this.previous = this.mdbTable.getDataSource();
}

searchItems() {
  const prev = this.mdbTable.getDataSource();
  if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
  }
  if (this.searchText) {
    /*Busqueda dentro de los datos de la tabla, si se desea agregar un nuevo campo a la busqueda,
      Solo hay que agregar al arreglo de la funcion el nombre del indice usado en fillItems()
      para el campo que se desea incluir en la busqueda*/
      this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['Nombre', 'Correo', 'Tecnologias', 'Profesion']);
      this.mdbTable.setDataSource(prev);
  }
}


//mostrar el perfil del desarrollador seleccionado
mostrarProfesional(content,id){
  console.log('ver prof');
  this.open(content);
  this.idElement=parseInt(id);
}

//modal
open(content) {
  this.modalService.open(content,{ size: 'lg' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

//relacionado con la foto de perfil
getImage(): Observable<SafeResourceUrl> {
  return  this.authService.getProfilePicDev();
}


}
