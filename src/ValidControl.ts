import Control from "sap/ui/core/Control";
export default class ValidControl {
	control: Control;
	property: string;
	isValid: boolean;
	constructor(control: Control, property: string) {
		this.control = control;
		this.property = property;
		this.isValid = false;
	}
}
