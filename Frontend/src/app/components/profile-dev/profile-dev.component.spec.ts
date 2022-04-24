import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDevComponent } from './profile-dev.component';

describe('ProfileDevComponent', () => {
  let component: ProfileDevComponent;
  let fixture: ComponentFixture<ProfileDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
