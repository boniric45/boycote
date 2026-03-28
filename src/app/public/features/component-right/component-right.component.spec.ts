import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRightComponent } from './component-right.component';

describe('ComponentRightComponent', () => {
  let component: ComponentRightComponent;
  let fixture: ComponentFixture<ComponentRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
