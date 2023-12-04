import BaseController from "./BaseController";
import Validator from "ui5/genericvalidator/Validator";
import Form from "sap/ui/layout/form/Form";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

/**
 * @namespace ui5.genericvalidator.demo.controller
 */
export default class Main extends BaseController {
	public onInit(): void {
		const oModel: ODataModel =
			this.getOwnerComponent().getModel() as ODataModel;
		oModel.metadataLoaded().then(() => {
			const sObjectPath = oModel.createKey("/Suppliers", {
				ID: 0
			});
			const oTestForm: Form = this.byId("odataTestForm") as Form;
			oTestForm.bindElement(sObjectPath);
		});
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
	public onOdataFormValidatorButtonPress(): void {
		const oTestForm: Form = this.byId("odataTestForm") as Form;
		const oValidator = new Validator(oTestForm);
		oValidator.validate();
	}
}
