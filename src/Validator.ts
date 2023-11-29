/*!
 * ${copyright}
 */

// Provides control ui5.genericvalidator.
import Log from "sap/base/Log";
import Object from "sap/ui/base/Object";
import Control from "sap/ui/core/Control";
import ValidatorOptions from "./ValidatorOptions";
import ManagedObject from "sap/ui/base/ManagedObject";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import ValidControl from "./ValidControl";
import { ValueState } from "sap/ui/core/library";
import MessageType from "sap/ui/core/message/MessageType";
import View from "sap/ui/core/mvc/View";

/**
 * Constructor for a new <code>ui5.genericvalidator</code> control.
 *
 * Some class description goes here.
 * @extends sap.ui.core.Control
 *
 * @version ${version}
 *
 * @constructor
 * @public
 * @name ui5.genericvalidator.Validator
 */

export default class Validator extends Object {
	baseControl: ManagedObject;
	fieldGroupID: string;
	validControls: ValidControl[];
	options: ValidatorOptions;
	view: View;
	constructor(baseControl?: ManagedObject, fieldGroupID?: string, view?: View) {
		super();

		this.baseControl = baseControl || null;
		this.fieldGroupID = fieldGroupID || null;
		this.view = view || null;
		this.options = new ValidatorOptions(); // Assuming ValidatorOptions has default values.
		this.validControls = [];

		if (this.baseControl) {
			this.addValidControls(this.baseControl);
		} else if (this.fieldGroupID) {
			this.addValidControlsByFieldGroupID();
		} else {
			throw new Error("Validator requires either a base control or a field group ID.");
		}
	}
	private addValidControlsByFieldGroupID() {
		let aControls: Control[] = [];
		if (this.view) {
			aControls = this.view.getControlsByFieldGroupId(this.fieldGroupID);
		} else {
			aControls = Control.getControlsByFieldGroupId(this.fieldGroupID);
		}
		this.validControls = this.filterValidControls(aControls);
	}
	private filterValidControls(controls: Control[]): ValidControl[] {
		const aReturnControls: ValidControl[] = [];
		for (let index = 0; index < controls.length; index++) {
			const oControl = controls[index];
			const sProperty = this.getValidProperty(oControl);
			if (sProperty) {
				const oValidControl = new ValidControl(oControl, sProperty);
				aReturnControls.push(oValidControl);
			}
		}
		return aReturnControls;
	}

	private addValidControls(baseControl: ManagedObject) {
		const sProperty = this.getValidProperty(baseControl);
		if (sProperty) {
			const oValidControl = new ValidControl(baseControl as Control, sProperty);
			this.validControls.push(oValidControl);
		} else {
			this._findAggregation(baseControl);
		}
	}
	private getValidProperty(baseControl: ManagedObject): string {
		if (!this.checkProperties(baseControl as Control)) return;
		return this._hasType(baseControl);
	}

	private checkProperties(control: Control): boolean {
		if (!control.getVisible()) {
			return false;
		}
		// Check if getEnabled method exists and if the control is enabled
		if (typeof control.getEnabled === "function" && !control.getEnabled()) {
			return false;
		}
		// Check if getEditable method exists and if the control is editable
		if (typeof control.getEditable === "function" && !control.getEditable()) {
			return false;
		}
		return true;
	}
	private _hasType(oControl: ManagedObject): string {
		// check if a data type exists (which may have validation constraints)
		for (let i = 0; i < this.options.validateProperties.length; i += 1) {
			const oBinding: PropertyBinding = oControl.getBinding(this.options.validateProperties[i]) as PropertyBinding;
			if (oBinding && oBinding.getType()) {
				return this.options.validateProperties[i];
			}
		}
		return;
	}
	private _findAggregation(oControl: ManagedObject) {
		for (let i = 0; i < this.options.possibleAggregations.length; i += 1) {
			const aControlAggregation: ManagedObject | ManagedObject[] = oControl.getAggregation(this.options.possibleAggregations[i]);

			if (!aControlAggregation) continue;

			if (aControlAggregation instanceof Array) {
				// generally, aggregations are of type Array
				for (let j = 0; j < aControlAggregation.length; j += 1) {
					this.addValidControls(aControlAggregation[j]);
				}
			} else {
				// ...however, with sap.ui.layout.form.Form, it is a single object *sigh*
				this.addValidControls(aControlAggregation);
			}
		}
	}
	public validate() {
		for (let index = 0; index < this.validControls.length; index++) {
			const oControl = this.validControls[index];
			if (this.checkRequierd(oControl.control)) {
				this._validateRequierd(oControl);
			} else {
				this._validateConstraint(oControl);
			}
		}
	}
	private checkRequierd(control: Control): boolean {
		// Check if getEnabled method exists and if the control is enabled
		if (typeof control.getRequired === "function" && !control.getRequired()) {
			return false;
		}

		return true;
	}
	private _validateRequierd(oValidControl: ValidControl) {
		const oControl: Control = oValidControl.control;
		const sProperty: string = oValidControl.property;
		const oExternalValue = oControl.getProperty(sProperty);
		if (!oExternalValue || oExternalValue === "") {
			this._setValueState(oControl, ValueState.Error, "Please fill this mandatory field!");
			oValidControl.isValid = true;
		} else {
			this._validateConstraint(oValidControl);
		}
	}
	private _validateConstraint(oValidControl: ValidControl) {
		const oControl: Control = oValidControl.control;
		const sProperty: string = oValidControl.property;
		try {
			// try validating the bound value
			const oControlBinding: PropertyBinding = oControl.getBinding(sProperty) as PropertyBinding;
			const oExternalValue = oControl.getProperty(sProperty);
			const oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
			oControlBinding.getType().validateValue(oInternalValue);
			oControl.setValueState(ValueState.None);
			oValidControl.isValid = true;
		} catch (ex) {
			// catch any validation errors
			oValidControl.isValid = false;
			this._setValueState(oControl, ValueState.Error, ex.message);
		}
	}
	private _setValueState(oControl: Control, eValueState: ValueState, sText: string) {
		oControl.setValueState(eValueState);
		if (oControl.getValueStateText && !oControl.getValueStateText()) oControl.setValueStateText(sText);
	}
	private _convertValueStateToMessageType = function (eValueState: ValueState) {
		const valueStateToMessageType = {
			[ValueState.Error]: MessageType.Error,
			[ValueState.Information]: MessageType.Information,
			[ValueState.None]: MessageType.None,
			[ValueState.Success]: MessageType.Success,
			[ValueState.Warning]: MessageType.Warning
		};

		// Default to MessageType.Error if eValueState is not in the map
		return valueStateToMessageType[eValueState] || MessageType.Error;
	};
	public printMessage(message: string) {
		Log.error(message);
	}
}