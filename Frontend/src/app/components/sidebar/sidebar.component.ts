import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'abe-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  goMisProyectos(){
    this.router.navigate(['/projects']);
  }

  goPublicarProyecto(){
    this.router.navigate(['/newProject']);
  }

  goBuscarTalento(){
    this.router.navigate(['/search-prof']);
  }
  goContactos(){}

}
