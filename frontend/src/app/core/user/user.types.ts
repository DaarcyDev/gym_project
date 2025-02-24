export interface User {
	id?: string;
	name?: string;
	email?: string;
	hash?: string;
	image?: string;
	avatar?: string;
	status?: string;
	tipo_login?: string;
	tipo_usuario?: string;
	companyType?: string;
	user?: string;
	// accessToken: string;
	refresh_token: string;
}