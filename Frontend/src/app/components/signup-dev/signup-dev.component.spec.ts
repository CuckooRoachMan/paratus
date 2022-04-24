import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDevComponent } from './signup-dev.component';

describe('SignupDevComponent', () => {
  let component: SignupDevComponent;
  let fixture: ComponentFixture<SignupDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
