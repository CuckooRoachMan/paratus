import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProfComponent } from './search-prof.component';

describe('SearchProfComponent', () => {
  let component: SearchProfComponent;
  let fixture: ComponentFixture<SearchProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchProfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
