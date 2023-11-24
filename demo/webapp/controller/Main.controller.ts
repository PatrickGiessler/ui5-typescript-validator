import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import Validator from "ui5/genericvalidator/Validator";

/**
 * @namespace ui5.genericvalidator.demo.controller
 */
export default class Main extends BaseController {
	public sayHello(): void {
		MessageBox.show("Hello World!");
		const a = new Validator();
	}
}
