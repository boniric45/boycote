import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabineEditorComponent } from './cabine-editor.component';

describe('CabineEditorComponent', () => {
  let component: CabineEditorComponent;
  let fixture: ComponentFixture<CabineEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabineEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
