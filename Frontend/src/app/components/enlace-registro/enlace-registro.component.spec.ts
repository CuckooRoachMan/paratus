import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnlaceRegistroComponent } from './enlace-registro.component';

describe('EnlaceRegistroComponent', () => {
  let component: EnlaceRegistroComponent;
  let fixture: ComponentFixture<EnlaceRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnlaceRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnlaceRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
