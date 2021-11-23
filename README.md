# ui5-typescript-control-library - a Sample UI5 Control Library Developed in TypeScript

This repository demonstrates and explains how to develop UI5 control libraries in TypeScript.

## Table of Contents

  * [Description](#description)
  * [Requirements](#requirements)
  * [Installation / Setup](#installation---setup)
  * [Usage](#usage)
  * [Things to Consider When Developing Control Libraries in TypeScript](#things-to-consider-when-developing-control-libraries-in-typescript)
    + [TypeScript Transpilation](#typescript-transpilation)
    + [tsconfig.json](#tsconfigjson)
    + [ui5.yaml](#ui5yaml)
    + [Control Implementation](#control-implementation)
    + [library.ts](#libraryts)
    + [ESLint](#eslint)
    + [Tests](#tests)
  * [How to Convert a Library to TypeScript](#how-to-convert-a-library-to-typescript)
  * [Known Issues](#known-issues)
  * [How to obtain support](#how-to-obtain-support)
  * [Contributing](#contributing)
  * [Credits](#credits)
  * [License](#license)

## Description

This is an example UI5 control library, implemented in TypeScript, including tests, themes (CSS/LESS files), a sample page for trying the control(s), and the entire tool setup for TypeScript transpilation, UI5 build, code linting, etc.
The starting point of this library was generated with [generator-ui5-library](https://github.com/geert-janklaps/generator-ui5-library) and then manually converted to TypeScript.

## Requirements

* git client, Node.js

## Installation / Setup

```sh
git clone https://github.com/SAP-samples/ui5-typescript-control-library.git
cd ui5-typescript-control-library
npm i
```

## Usage

Start the control sample page in watch mode:

```sh
npm run watch
```

This opens the example control sample page in a browser window and launches the project in watch mode, which triggers several things at once whenever any code is changed:
* A re-generation of the TypeScript interfaces for the controls (so TypeScript knows all the generated control methods)
* A transpilation of the TypeScript code to JavaScript
* A reload of the page displayed in the browser

This is the mode in which you can best develop the controls within this library when doing changes to the control metadata or creating new controls.<br>
When the control APIs remain stable, you can also use `npm start` instead, which does almost the same, but skips the TypeScript interface generation.

<b>NOTE:</b> as mentioned above, while you extend/change the API of your control(s), TypeScript needs to be made aware of the methods generated by the UI5 framework at runtime (like `getText()` and `setText(...)` for a `text` property). This happens using the npm package [@ui5/ts-interface-generator](https://github.com/SAP/ui5-typescript/tree/main/packages/ts-interface-generator) (see link for details). This generator runs whenever a file is saved and creates a `*.generated.tsinterface.ts` file with the needed declarations next to each control file. So when TypeScript does not seem to know control API accessor methods, save the file and this problem should be gone. Those generated files will be overwritten and may be deleted automatically by the generator, so do not bother to change them.

<b>Also NOTE:</b> developing a control library in TypeScript comes with a few peculiarities, so please read the respective section below.

## Things to Consider When Developing Control Libraries in TypeScript

This section walks you through noteworthy points which are different or special in comparison to standard JavaScript development.

Topics like the themes/CSS and the translation texts are not different at all and hence not explained here. The choice to use Karma for testing and the overall test setup are coming from the underlying [library template](https://github.com/geert-janklaps/generator-ui5-library) and hence also not explained here.


### TypeScript Transpilation

In general, the TypeScript transpilation is set up as explained in the [step-by-step description](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/main/step-by-step.md) in the Hello World application project, using Babel and the "[babel-preset-transform-ui5](https://www.npmjs.com/package/babel-preset-transform-ui5)", configured in the files `.babelrc.json` and `tsconfig.json`.

In `package.json`, the actual TypeScript transpilation is triggered, e.g. in the `build:ts` script:

```sh
babel src --out-dir src-gen --extensions \".ts,.js\" --copy-files --include-dotfiles
```

The `--include-dotfiles` option is important to get the `.library` file copied over. The test resources are transpiled separately, as they have a different target directory.

### tsconfig.json

In `tsconfig.json`, the `src` and `test` folders are configured to be the source folders. (`src-gen` is configured as output folder, but this configuration setting is not used during normal transpilation, where the output location is directly set in the respective Babel calls in `package.json`, as shown above).

To make references using the library name work, a path mapping is configured, which points to the respective path below the `src` folder:
```
"paths": {
	"com/myorg/myUI5Library/*": [
		"./src/com/myorg/myUI5Library/*"
	]
}
```


### ui5.yaml

Usually the JavaScript library sources are inside the `src` folder and built/served from there by the UI5 tooling. Now the *TypeScript* sources are inside this folder and transpiled to the `src-gen` folder. The same is the case for `test` (transpiled to `test-gen`). To build/serve the correct JavaScript resources, the `ui5.yaml` file contains the following section:
```yaml
resources:
  configuration:
    paths:
      src: src-gen
      test: test-gen
```
The "livereload" middleware for watch mode is also configured to work on these directories.


### Control Implementation

General aspects of control development in TypeScript are also explained in the [`custom-controls` branch of the "Hello World" repository](https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls).

As explained there, an additional named export of the control must be added to let the generated interface with all the API accessor methods be merged by TypeScript, so the control needs to be exported twice:
```ts
export { Example }; // needed for merging the generated interface
export default Example;
```
And one needs to manually copy the constructor signatures from the terminal output of the interface generator into the control implementation:
```ts
// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
constructor(id?: string | $ExampleSettings);
constructor(id?: string, settings?: $ExampleSettings);
constructor(id?: string, settings?: $ExampleSettings) { super(id, settings); }
```

As also explained in that other project, the namespace of the control needs to be defined. In contrast to there, now an `@name` JSDoc tag with the *full* name is used:
```
@name com.myorg.myUI5Library.Example
```

Also in contrast to the custom control in that other project, the Renderer is implemented in a separate file, like it is typically done in the original UI5 libraries. But both options are equally valid. 

The following is not specific to TypeScript, but you may not be aware: at the beginning of the file, there is a `${copyright}` placeholder. When you don't remove it, it will be replaced during the UI5 build with content from the `.library` file.


### library.ts

In the `library.ts` file there is one thing to keep in mind:<br>
In UI5 Libraries implemented in JavaScript, enums must be directly appended to the global namespace of the library. This is required by the UI5 runtime to find the enum type when used for control properties.<br>
The same is also done here, but as the global object is not known by TypeScript, the object is first acquired using the [`ObjectPath` API](https://openui5.hana.ondemand.com/api/module:sap/base/util/ObjectPath#methods/sap/base/util/ObjectPath.get):
```js
const thisLib = ObjectPath.get("com.myorg.myUI5Library");
```
Then the enum is attached to this object:
```js
thisLib.ExampleColor = ExampleColor;
```

This is important to be done for all enums. Most things will still seem to work when not doing it, but when the enum is used as type for a control property, UI5 will not be able to find the type (the console will show this as an issue!) and then stop type checking for this property, which can even result in an XSS vulnerability.<br>
This is not intuitive and quite easy to forget, therefore it is intended to get the UI5 transformer modified to do this automatically. 

When the `${version}` placeholder is used, it is replaced with the version from the `.library` file.

### ESLint

TypeScript code linting is configured for this repository, using the "eslint", "@typescript-eslint/eslint-plugin" and "@typescript-eslint/parser" npm packages and the `eslintrc.json` file. It is triggered using the npm `lint` script.

### Tests

The `test` directory contains a QUnit-based unit test setup. There is actually nothing TypeScript-specific in that area, but one thing to note:<br>
The project uses private APIs in the testing area, e.g. resources/sap/ui/test/starter/createSuite.js. This is because the underlying template does so and should be replaced by a cleaner solution.


## How to Convert a Library to TypeScript

If you don't want to simply use the control library in this repository as starting point, e.g. because you already have an existing control library implemented in JavaScipt, you can follow the below steps to convert it to TypeScript:

1. Add the `tsconfig.json` and `.babelrc.json` files to the root directory, with content like in this repository
1. Add dependencies to the required type definitions, to the Babel transpiler and its UI5 plugin, and to the interface generator for controls:
    * `npm install --save-dev typescript @types/openui5@1.95.0 @types/jquery@3.5.1 @types/qunit@2.5.4` (you can also use the [@sapui5/ts-types-esm](https://www.npmjs.com/package/@sapui5/ts-types-esm) types instead of the OpenUI5 ones when working with SAPUI5.)
    * `npm install --save-dev @babel/core @babel/cli @babel/preset-env`
    * `npm install --save-dev @babel/preset-typescript babel-preset-transform-ui5`
    * `npm install --save-dev @ui5/ts-interface-generator`
1. Rename the JavaScript file extensions to `*.ts` and convert their content to TypeScript.
    *  Depending on the amount of code, this can be major effort, but it can be done partially/increasingly. To avoid TypeScript errors during the transition phase, start with files that have no dependencies to not-yet-converted files.
    * In general, look at the respective files inside this repository to understand how your files should look after conversion. Apart from that, you can also find help by looking at the existing documentation for UI5 applications, e.g. regarding the [project setup](https://github.com/SAP-samples/ui5-typescript-helloworld/blob/main/step-by-step.md) and the [code conversion](https://github.com/SAP-samples/ui5-cap-event-app/blob/typescript/docs/typescript.md#converting-ui5-apps-from-javascript-to-typescript).
    * Like all UI5 modules written in TypeScript, the control files need to be written as standard ES6 modules and like all UI5 classes written in TypeScript, the controls need to be written as standard ES6 classes. This means:
      ```ts
      sap.ui.define([
        "./library", 
        "sap/ui/core/Control", 
        "./ExampleRenderer"
      ], function (library, Control, ExampleRenderer) {
        var ExampleColor = library.ExampleColor;
      ```
      needs to be converted to:
      ```ts
      import Control from	"sap/ui/core/Control";
      import ExampleRenderer from "./ExampleRenderer";
      import { ExampleColor } from "./library";
      ```
      and
      ```ts
      var Example = Control.extend("com.myorg.myUI5Library.Example", {
        metadata: { ... },
        onclick: function() {
          ...
        }
        ...
      ```
      needs to be converted to:
      ```ts
      /**
       * @name com.myorg.myUI5Library.Example
       */
      class Example extends Control {
        static readonly metadata = { ... }
        onclick = () => {
	        ...
        }
        ...
      ```
    * The `library.ts` file also needs to be converted to an ES6 module. But the `sap.ui.getCore().initLibrary({...})` call needs to remain as-is (using the global `sap` object) to support preloading the library with synchronous bootstrap.<br>
    Enums defined within the file can be written as standard TypeScript enums and exported as named exports:
      ```ts
      export enum ExampleColor { ... }
      ```
      But for the time being, each enum also must be added to the global library object *in addition*, in order to enable the UI5 runtime to find it when given as type for a control property. This is because control property types are given as global names: `type: "com.myorg.myUI5Library.ExampleColor"`. Do so by acquiring the global object and attaching each enum like this:
      ```ts
      const thisLib = ObjectPath.get("com.myorg.myUI5Library");
      thisLib.ExampleColor = ExampleColor;
      ```
      It is intended to handle this automatically during the code transformation in the future.
    * While converting control files, it makes sense to run the control interface generator in watch mode, to have interfaces with all the setters, getters etc. for properties, aggregations, events etc. generated, so TypeScript knows about them: `npx @ui5/ts-interface-generator --watch`
    * Note: the JSDoc for controls/classes may not contain the `@param` or `@class` JSDoc tag, otherwise the UI5 transformer will not convert the code structure to the classic UI5 class definition.
1. Run the Babel-based TypeScript transpilation: `npx babel src --out-dir src-gen --extensions ".ts,.js" --copy-files --include-dotfiles`
1. Adapt the content of the `.library` file which is used during the UI5 build
1. Adapt `ui5.yaml` to ensure UI5 knows the correct location of the JavaScript sources (in `src-gen`/`test-gen`, see the `ui5.yaml` file in this repository for an example)
1. It is recommented to persist the various commands as scripts in `package.json`, so you don't have to re-type them every time (the below suggestion requires a small tool, which you can install with `npm i --save-dev npm-run-all`):
    * `"build": "run-s build:ts build:test-ts build:ui5",`
    * `"build:ts": "babel srcs --out-dir src-gen --extensions \".ts,.js\" --copy-files --include-dotfiles",`
    * `"build:test-ts": "babel tests --out-dir test-gen --extensions \".ts,.js\" --copy-files --include-dotfiles",`
    * `"build:ui5": "ui5 build --clean-dest",`
    * `"watch:controls": "npx @ui5/ts-interface-generator --watch"`
1. While the functional setup is now done, you can choose to add further utilities helping with development. The exact setup can be seen inside this repository. Examples are:
    * Linting using ESLint: add the `.eslint.json` configuration file and dependencies to ESLint and its TypeScript plugins: `npm i --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`
    * Watch mode for the UI5-based preview of the control sample pages, using the [ui5-middleware-livereload](https://www.npmjs.com/package/ui5-middleware-livereload) (don't forget to configure `src-gen` and `test-gen` as paths in the middleware configuration in `ui5.yaml`!)


## Known Issues

There are limitations, including:
* The project uses private APIs in the testing area, e.g. `resources/sap/ui/test/starter/createSuite.js`. This is because the underlying template does so and only some of the private API usages have been removed so far.

## How to obtain support

This project is provided *as-is*, without any support guarantees.

However, you are encouraged to [create an issue](https://github.com/SAP-samples/ui5-typescript-control-library/issues) in this repository or open a pull request if you find a bug or have have an improvement suggestion.

## Contributing

If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## Credits

This project has been generated with 💙 and [generator-ui5-library](https://github.com/geert-janklaps/generator-ui5-library) and then adapted to TypeScript.

## License
Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.