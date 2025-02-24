import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpensesService } from 'app/core/expenses/expenses.service';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
	selector: 'app-attach-cfdi-sidebar',
	standalone: true,
	imports: [MatFormFieldModule, MatSelectModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, CommonModule, NgFor, NgIf,
		MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatSnackBarModule
	],
	templateUrl: './attach-cfdi-sidebar.component.html',
	styleUrl: './attach-cfdi-sidebar.component.scss'
})
export class AttachCFDISidebarComponent {
	@Input() documentXml: any;
	@Input() fileNameXml: any;
	@Input() documentPdf: any;
	@Input() fileNamePdf: any;
	@Input() dataId: any;
	@Input() dataName: any;
	@Output() form = new EventEmitter<any>();

	filtersFormGroup: FormGroup;
	sidebarOpen: boolean = true;

	fileTypePdf: any;
	showDocumentPdf: boolean = false;

	fileTypeXml: any;
	showDocumentXml: boolean = false;
	private _snackBar = inject(MatSnackBar);
	constructor(
		private formBuilder: FormBuilder,
		private _changeDetectorRef: ChangeDetectorRef,
		private expensesService: ExpensesService,
	) {
	}

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
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
		if (type === 'pdf') {
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
	}

	openSnackBar(message: string, isSuccess: boolean): void {
		this._snackBar.open(message, '', {
			horizontalPosition: 'right',
			verticalPosition: 'top',
			duration: 4000, // Duración en milisegundos
			panelClass: [isSuccess ? 'success-snackbar' : 'error-snackbar', 'center-text-snackbar'],
		});
	}

	enviar(): void {

		let requestParams = {
			expense_id: this.dataId,
			pdf_name: this.fileNamePdf,
			xml_name: this.fileNameXml,
			pdf_file: this.documentPdf,
			xml_file: this.documentXml
		}

		this.expensesService.SendDocumentsExpenses(requestParams).subscribe((res) => {
			if (res?.result?.status == true) {
				this.openSnackBar('Comprobantes subidos correctamente.', true)
				let data = res?.result?.data
				let datos : any = {
					cfdi_pdf_binary: data.cfdi_pdf_binary,
					cfdi_pdf_binary_filename: data.cfdi_pdf_binary_filename,
					cfdi_binary: data.cfdi_binary,
					cfdi_binary_filename: data.cfdi_binary_filename,
				}
				this.form.emit(datos);
			}
			else {
				this.openSnackBar('Error al subir comprobantes.', false)
			}
		})
	}
}
