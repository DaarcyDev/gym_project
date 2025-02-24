import { Component, Input, Inject, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
@Component({
	selector: 'custom-stepper',
	standalone: true,
	imports: [MatIconModule, CommonModule, NgFor, NgIf, MatDialogModule, MatInputModule, MatButtonModule, MatMenuModule ],
	templateUrl: './custom-stepper.component.html',
	styleUrl: './custom-stepper.component.scss'
})
export class CustomStepperComponent {

	@Input() states: any;
	@Input() st: string;

	private _unsubscribeAll: Subject<any> = new Subject<any>();

	states_length: number;
	side: number;
	arrow: boolean = false;
	button: boolean = false;

	constructor(
		public breakpointObserver: BreakpointObserver,
	){
		this.breakpointObserver
			.observe(['(min-width: 600px)'])
			.pipe(
				takeUntil(this._unsubscribeAll)
			)
			.subscribe((state: BreakpointState) => {
				if (state.matches) {
					this.side = 6;
				} else{
					this.side = 5;
				}
			});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.states){
			let states = changes.states
			let st = changes.st
			for (let key in states.currentValue) {
				if (states.currentValue[key].name === 'Cargando facturas' && st.currentValue === 'Cargando facturas') {
					this.button = true;
				}
			}
		}
	}

	getState(state: string): number {
		return this.states.findIndex(e => e.name === state);
	}

	textLong(texto: string): string {
		if (texto) {
			if (texto.length > this.side){
				texto = texto.slice(0, this.side) + '...';
			}
			return texto
		}
		else {
			return ""
		}
	}

	buttonMenu(){
		if(this.arrow === false){
			this.arrow = true;
		}
		if (this.arrow === true) {
			this.arrow = false;
		}
	}
}
