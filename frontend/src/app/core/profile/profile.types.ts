export interface Profile {
	method: string;
	user: string;
	hash: string;
	name: string;
	image: string | boolean;
	regimen_fiscal: string | boolean;
	email: string;
	telefono: string;
	calle: string;
	numero_exterior: string;
	numero_interior: string;
	colonia: string;
	ciudad: string;
	cp: string;
	state_id: number | boolean;
	country_id: number | boolean;
}

export interface ProfileCompany {
	method: string;
	user: string;
	hash: string;
	name: string;
	image: string | boolean;
	legal_id: string;
	regimen_fiscal: string | boolean;
	email: string;
	website: string;
	telefono: string;
	calle: string;
	colonia: string;
	ciudad: string;
	cp: string;
	state_id: number | boolean;
	country_id: number | boolean;
	movil: string;
}