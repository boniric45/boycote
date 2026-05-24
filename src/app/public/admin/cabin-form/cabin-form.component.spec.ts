import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinFormComponent } from './cabin-form.component';

describe('CabinFormComponent', () => {
  let component: CabinFormComponent;
  let fixture: ComponentFixture<CabinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabinFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
