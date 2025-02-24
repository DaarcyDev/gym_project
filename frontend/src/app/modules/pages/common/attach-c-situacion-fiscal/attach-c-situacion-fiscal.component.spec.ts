import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachCSituacionFiscalComponent } from './attach-c-situacion-fiscal.component';

describe('AttachCSituacionFiscalComponent', () => {
  let component: AttachCSituacionFiscalComponent;
  let fixture: ComponentFixture<AttachCSituacionFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachCSituacionFiscalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachCSituacionFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
