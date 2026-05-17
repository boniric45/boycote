import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGenderComponent } from './add-gender.component';

describe('AddGenderComponent', () => {
  let component: AddGenderComponent;
  let fixture: ComponentFixture<AddGenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
