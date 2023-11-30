/*!
 * ${copyright}
 */
sap.ui.define(["sap/base/Log", "sap/ui/base/Object", "sap/ui/core/Control", "./ValidatorOptions", "./ValidControl", "sap/ui/core/library", "sap/ui/core/message/MessageType"], function (Log, Object, Control, __ValidatorOptions, __ValidControl, sap_ui_core_library, MessageType) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ValidatorOptions = _interopRequireDefault(__ValidatorOptions);
  const ValidControl = _interopRequireDefault(__ValidControl);
  const ValueState = sap_ui_core_library["ValueState"];
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
  const Validator = Object.extend("ui5.genericvalidator.Validator", {
    constructor: function _constructor(baseControl, fieldGroupID, view) {
      Object.prototype.constructor.call(this);
      this._convertValueStateToMessageType = function (eValueState) {
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
    },
    addValidControlsByFieldGroupID: function _addValidControlsByFieldGroupID() {
      let aControls = [];
      if (this.view) {
        aControls = this.view.getControlsByFieldGroupId(this.fieldGroupID);
      } else {
        aControls = Control.getControlsByFieldGroupId(this.fieldGroupID);
      }
      this.validControls = this.filterValidControls(aControls);
    },
    filterValidControls: function _filterValidControls(controls) {
      const aReturnControls = [];
      for (let index = 0; index < controls.length; index++) {
        const oControl = controls[index];
        const sProperty = this.getValidProperty(oControl);
        if (sProperty) {
          const oValidControl = new ValidControl(oControl, sProperty);
          aReturnControls.push(oValidControl);
        }
      }
      return aReturnControls;
    },
    addValidControls: function _addValidControls(baseControl) {
      const sProperty = this.getValidProperty(baseControl);
      if (sProperty) {
        const oValidControl = new ValidControl(baseControl, sProperty);
        this.validControls.push(oValidControl);
      } else {
        this._findAggregation(baseControl);
      }
    },
    getValidProperty: function _getValidProperty(baseControl) {
      if (!this.checkProperties(baseControl)) return;
      return this._hasType(baseControl);
    },
    checkProperties: function _checkProperties(control) {
      if (typeof control.getVisible === "function" && !control.getVisible()) {
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
    },
    _hasType: function _hasType(oControl) {
      // check if a data type exists (which may have validation constraints)
      for (let i = 0; i < this.options.validateProperties.length; i += 1) {
        const oBinding = oControl.getBinding(this.options.validateProperties[i]);
        if (oBinding && oBinding.getType()) {
          return this.options.validateProperties[i];
        }
      }
      return;
    },
    _findAggregation: function _findAggregation(oControl) {
      for (let i = 0; i < this.options.possibleAggregations.length; i += 1) {
        const aControlAggregation = oControl.getAggregation(this.options.possibleAggregations[i]);
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
    },
    validate: function _validate() {
      for (let index = 0; index < this.validControls.length; index++) {
        const oControl = this.validControls[index];
        if (this.checkRequierd(oControl.control)) {
          this._validateRequierd(oControl);
        } else {
          this._validateConstraint(oControl);
        }
      }
    },
    checkRequierd: function _checkRequierd(control) {
      // Check if getEnabled method exists and if the control is enabled
      if (typeof control.getRequired === "function" && !control.getRequired()) {
        return false;
      }
      return true;
    },
    _validateRequierd: function _validateRequierd(oValidControl) {
      const oControl = oValidControl.control;
      const sProperty = oValidControl.property;
      const oExternalValue = oControl.getProperty(sProperty);
      if (!oExternalValue || oExternalValue === "") {
        this._setValueState(oControl, ValueState.Error, "Please fill this mandatory field!");
        oValidControl.isValid = true;
      } else {
        this._validateConstraint(oValidControl);
      }
    },
    _validateConstraint: function _validateConstraint(oValidControl) {
      const oControl = oValidControl.control;
      const sProperty = oValidControl.property;
      try {
        // try validating the bound value
        const oControlBinding = oControl.getBinding(sProperty);
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
    },
    _setValueState: function _setValueState(oControl, eValueState, sText) {
      oControl.setValueState(eValueState);
      if (oControl.getValueStateText && !oControl.getValueStateText()) oControl.setValueStateText(sText);
    },
    printMessage: function _printMessage(message) {
      Log.error(message);
    }
  });
  return Validator;
});