import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-detail-contracts-document',
    standalone: true,
    templateUrl: './detail-contracts-modal.component.html',
    styleUrls: ['./detail-contracts-modal.component.scss'],
    imports: [
        CommonModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class DetailContractDocument {
    @Output() accept = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<void>();

    inputText: string = '';

    constructor(
        public dialogRef: MatDialogRef<DetailContractDocument>
    ) { }

    onInputChange(value: string) {
        this.inputText = value;
    }

    onAccept() {
        this.dialogRef.close();
    }

    onCancel() {
        this.dialogRef.close();
    }
}