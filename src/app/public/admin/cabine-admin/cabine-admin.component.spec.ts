import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabineAdminComponent } from './cabine-admin.component';

describe('CabineAdminComponent', () => {
  let component: CabineAdminComponent;
  let fixture: ComponentFixture<CabineAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabineAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabineAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
