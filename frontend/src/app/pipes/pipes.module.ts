import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncatePipe, TruncateWithExtPipe } from './truncate.pipe';

@NgModule({
	imports: [
		CommonModule,
	],
	declarations: [
		TruncatePipe,
		TruncateWithExtPipe,
	],
	exports: [
		TruncatePipe,
		TruncateWithExtPipe,
	]
})
export class PipesModule { }
