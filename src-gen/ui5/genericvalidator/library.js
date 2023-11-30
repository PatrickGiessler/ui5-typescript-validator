/*!
 * ${copyright}
 */
sap.ui.define(["sap/base/util/ObjectPath", "sap/ui/core/Lib", "./ValidatorOptions", "./ValidControl"], function (ObjectPath, Lib, __ValidatorOptions, __ValidControl) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ValidatorOptions = _interopRequireDefault(__ValidatorOptions);
  const ValidControl = _interopRequireDefault(__ValidControl);
  /**
   * Initialization Code and shared classes of library com.myorg.myui5lib.
   */
  // delegate further initialization of this library to the Core
  // Hint: sap.ui.getCore() must still be used here to support preload with sync bootstrap!
  Lib.init({
    name: "ui5.genericvalidator",
    version: "${version}",
    dependencies: [
    // keep in sync with the ui5.yaml and .library files
    "sap.ui.core"],
    controls: ["ui5.genericvalidator.Validator"],
    noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
  });

  // get the library object from global object space because all enums must be attached to it to be usable as UI5 types
  // FIXME: this line is planned to become obsolete and may need to be removed later
  const thisLib = ObjectPath.get("ui5.genericvalidator");
  thisLib.options = ValidatorOptions;
  thisLib.validControl = ValidControl;

  // export the library namespace
  return thisLib;
});