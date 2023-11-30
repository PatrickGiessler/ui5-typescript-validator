sap.ui.define([], function () {
  "use strict";

  class ValidControl {
    constructor(control, property) {
      this.control = control;
      this.property = property;
      this.isValid = false;
    }
  }
  return ValidControl;
});