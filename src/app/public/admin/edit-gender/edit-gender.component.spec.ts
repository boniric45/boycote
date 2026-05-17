import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGenderComponent } from './edit-gender.component';

describe('EditGenderComponent', () => {
  let component: EditGenderComponent;
  let fixture: ComponentFixture<EditGenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
