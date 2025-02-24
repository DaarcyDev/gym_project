import { Component, EventEmitter, Inject, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpensesService } from 'app/core/expenses/expenses.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-document-card',
    standalone: true,
    templateUrl: './document-card.component.html',
    styleUrls: ['./document-card.component.scss'],
    imports: [
        MatCardModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        MatChipsModule
    ]
})
export class DocumentCardComponent {
    @Output() filesAccepted = new EventEmitter<File[]>();
    @Output() actionCanceled = new EventEmitter<void>();

    selectedFile1: File | null = null;
    selectedFile2: File | null = null;
    document: any;
    documentPdf: any;
    fileNamePdf: any;
    fileTypePdf: any;
    showDocumentPdf: boolean = false;

    documentXml: any;
    fileNameXml: any;
    fileTypeXml: any;
    showDocumentXml: boolean = false;

    requestParams: any;
    showData: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DocumentCardComponent>,
        private expensesService: ExpensesService,
        @Inject(MAT_DIALOG_DATA) public data: {
            id: any; name: any; documentXML: any; fileNameXML: any; documentPDF: any; fileNamePDF: any; }
    ) { }

    ngOnInit(): void {
        this.updateData(this.data);
    }

    updateData(data: any){
        if (data.documentPDF || data.fileNamePDF){
            this.documentPdf = data.documentPDF;
            this.fileNamePdf = data.fileNamePDF;
            this.showDocumentPdf = true;
        }
        if (data.documentXML || data.fileNameXML) {
            this.documentXml = data.documentXML;
            this.fileNameXml = data.fileNameXML;
            this.showDocumentXml = true;
        }
        this.showData = true;
    }

    onFileSelected(event: Event, fileIndex: number): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            if (fileIndex === 1) {
                this.selectedFile1 = input.files[0];
            } else if (fileIndex === 2) {
                this.selectedFile2 = input.files[0];
            }
        }
    }

    upDocumentPdf(event) {
        this.documentPdf = "";
        let file: File = event.target.files[0];
        let myReader: FileReader = new FileReader();

        this.fileNamePdf = file.name;
        this.fileTypePdf = file.type;

        myReader.readAsDataURL(file);
        myReader.onloadend = (e) => {
            this.documentPdf = (myReader.result as string).split(",", 2)[1];
            this.showDocumentPdf = true;

        }
    }

    upDocumentXml(event) {
        this.documentXml = "";
        let file: File = event.target.files[0];
        let myReader: FileReader = new FileReader();

        this.fileNameXml = file.name;
        this.fileTypeXml = file.type;

        myReader.readAsDataURL(file);
        myReader.onloadend = (e) => {
            this.documentXml = (myReader.result as string).split(",", 2)[1];
            this.showDocumentXml = true;

        }
    }

    removeFile(type: any) {
        if(type === 'pdf'){
            this.documentPdf = null;
            this.fileNamePdf = null;
            this.fileTypePdf = null;
            this.showDocumentPdf = false;

            // Resetea el input file
            const fileInput = document.getElementById('user_document_pdf') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        }
        if (type === 'xml') {
            this.documentXml = null;
            this.fileNameXml = null;
            this.fileTypeXml = null;
            this.showDocumentXml = false;

            // Resetea el input file
            const fileInput = document.getElementById('user_document_xml') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }

    downloadFile(type: any) {
        if (type === 'pdf'){
            const link = document.createElement('a');
            link.href = this.documentPdf;
            link.download = this.fileNamePdf;
            link.click();
        }
        if (type === 'xml') {
            const link = document.createElement('a');
            link.href = this.documentXml;
            link.download = this.fileNameXml;
            link.click();
        }
    }

    cerrar(): void {
        this.documentPdf = null;
        this.fileNamePdf = null;
        this.fileTypePdf = null;
        this.showDocumentPdf = false;
        this.documentXml = null;
        this.fileNameXml = null;
        this.fileTypeXml = null;
        this.showDocumentXml = false;

        const fileInputpdf = document.getElementById('user_document_pdf') as HTMLInputElement;
        if (fileInputpdf) {
            fileInputpdf.value = '';
        }

        const fileInput = document.getElementById('user_document_xml') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
        this.dialogRef.close();
    }

    enviar(): void {

        this.requestParams = {
            expense_id: this.data?.id,
            pdf_name: this.fileNamePdf,
            xml_name: this.fileNameXml,
            pdf_file: this.documentPdf,
            xml_file: this.documentXml
        }

        this.expensesService.SendDocumentsExpenses(this.requestParams).subscribe((res) => {
                if (res?.result?.status == true) {
                    this.dialogRef.close();
                }
            })
    }
}