import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'custom-stepper-mobile',
    standalone: true,
    templateUrl: './custom-stepper-mobile.component.html',
    styleUrl: './custom-stepper-mobile.component.scss',
    imports: [
        CommonModule, NgFor, NgIf,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class CustomStepperComponentMobile {
    @Output() accept = new EventEmitter<string>();
    @ViewChild('listItem') listItem: ElementRef;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    st: any;
    states: any;

    states_length: number;
    side: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<CustomStepperComponentMobile>,
        public breakpointObserver: BreakpointObserver,
    ) {
    }

    ngOnInit() {
        this.st = this.data.st;
        this.states = this.data.states;
        this.states_length = this.states.length;
    }

    ngAfterViewInit() {
        if (this.listItem) {
            this.listItem.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    getState(state: string): number {
        return this.states.findIndex(e => e.name === state);
    }

    onAccept() {
        this.dialogRef.close();
    }
}