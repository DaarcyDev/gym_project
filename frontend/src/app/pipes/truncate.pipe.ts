import { Pipe, PipeTransform } from '@angular/core';

/*

A pipe is a class decorated with pipe metadata.
The pipe class implements the PipeTransform interface's transform method that accepts an input value followed by optional parameters and returns the transformed value.
There will be one additional argument to the transform method for each parameter passed to the pipe. Your pipe has one such parameter: the exponent.
To tell Angular that this is a pipe, you apply the @Pipe decorator, which you import from the core Angular library.
The @Pipe decorator allows you to define the pipe name that you'll use within template expressions. It must be a valid JavaScript identifier. 

*/

/*
  This pipe truncates a string.
  Use it like so {{ String expression | truncate:10 }}
  This truncates the string to 10 letters and adds '...' to end.
*/

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {

	/*
	The transform method is essential to a pipe. The PipeTransform interface defines that method and guides both tooling and the compiler. Technically, it's optional; Angular looks for and executes the transform method regardless.
	*/

	transform(value: string, limit: number, completeWords = false, ellipsis = '...'): string {
		if (value) {
			/* if (completeWords) {
				limit = value.substring(0, limit).lastIndexOf(' ');
			} */
			return value.length > limit ? value.slice(0, limit) + ellipsis : value;
		}
		else {
			return ""
		}
	}
}

@Pipe({ name: 'truncateWithExt' })
export class TruncateWithExtPipe implements PipeTransform {

	/*
	The transform method is essential to a pipe. The PipeTransform interface defines that method and guides both tooling and the compiler. Technically, it's optional; Angular looks for and executes the transform method regardless.
	*/

	transform(value: string, limit: number, completeWords = false, ellipsis = '...'): string {
		if (value) {
			const parts = value.split('.');
			if (parts.length > 1) {
				const ext = parts.pop();
				return value.length > limit ? value.slice(0, limit) + ellipsis + ext : value;
			}
		}
		else {
			return ""
		}
	}
}