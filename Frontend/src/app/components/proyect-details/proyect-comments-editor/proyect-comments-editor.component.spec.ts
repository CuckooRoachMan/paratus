import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectCommentsEditorComponent } from './proyect-comments-editor.component';

describe('ProyectCommentsEditorComponent', () => {
  let component: ProyectCommentsEditorComponent;
  let fixture: ComponentFixture<ProyectCommentsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectCommentsEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectCommentsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
