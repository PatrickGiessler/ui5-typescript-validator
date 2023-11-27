import BaseController from "./BaseController";
import Validator from "ui5/genericvalidator/Validator";
import Form from "sap/ui/layout/form/Form";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace ui5.genericvalidator.demo.controller
 */
export default class Main extends BaseController {
	public onInit(): void {
		let oModel = new JSONModel({
			SupplierName: "A",
			Street: "Street",
			HouseNumber: "420",
			ZIPCode: "1234",
			City: "BBB",
			Country: "DE",
			Deep: "too deep"
		});
		this.getView().setModel(oModel);
	}
	public onFormValidatorButtonPress(): void {
		const oTestForm: Form = this.byId("testForm") as Form;
		const oValidator = new Validator(oTestForm);
		oValidator.validate();
	}
	public onInvisibleFormValidatorButtonPress(): void {
		const oTestForm: Form = this.byId("invisTestForm") as Form;
		const oValidator = new Validator(oTestForm);
		oValidator.validate();
	}
	public onFieldGroupValidatorButtonPress(): void {
		const oValidator = new Validator(null, "validate");
		oValidator.validate();
	}
}
