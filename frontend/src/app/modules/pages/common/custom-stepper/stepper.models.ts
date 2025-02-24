export interface State {
	id: string;
	name: string;
	position: number;
}
export interface States {
	current_state: string;
	position_state: string;
	states: State[];
}