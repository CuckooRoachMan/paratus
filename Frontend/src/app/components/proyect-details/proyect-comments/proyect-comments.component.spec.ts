import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectCommentsComponent } from './proyect-comments.component';

describe('ProyectCommentsComponent', () => {
  let component: ProyectCommentsComponent;
  let fixture: ComponentFixture<ProyectCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
