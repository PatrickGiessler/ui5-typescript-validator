sap.ui.define([], function () {
  "use strict";

  class ValidatorOptions {
    possibleAggregations = ["items", "content", "form", "formContainers", "formElements", "fields", "sections", "subSections", "_grid", "cells", "_page"];
    validateProperties = ["value", "selectedKey", "text"];
  }
  return ValidatorOptions;
});