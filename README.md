# hs-extension-tools

This repository is for extending upon the pre-existing functionality of the Hubspot Card Extension code.
It is used to add types to your serverless functions that work across the board for an extension, as well
as provides useQuery and useMutation hooks for interacting with the serverless functions without having
to write all of the boilerplate code that would go alongside them.

## Initial Project Setup

You'll need a tsconfig.json in the root of your extension project, since the whole project is going to
be in typescript.

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2018",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx"
  },
  "include": ["src/app/app.functions/*.ts"],
  "exclude": ["node_modules"]
}
```

Make sure to install typescript as well

```bash
npm install --save-dev typescript
```

After that, you'll want to add `gulp` for the compilation of the serverless functions.

```bash
npm install --save-dev gulp gulp-typescript
```

Then you'll want to add a gulpfile.js to the root of your project.

```javascript
const gulp = require("gulp");
const ts = require("gulp-typescript");

function compile() {
  return gulp
    .src("src/app/app.functions/**/*.ts")
    .pipe(
      ts({
        module: "CommonJS",
        target: "ES2018",
        moduleResolution: "node",
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        resolveJsonModule: true,
        jsx: "react-jsx",
      }),
    )
    .pipe(gulp.dest("src/app/app.functions/compiled"));
}

function watchFiles() {
  gulp.watch("src/app/app.functions/**/*.ts", compile);
}

exports.compile = compile;
exports.watch = watchFiles;
```

After that, you'll want to add a script to your package.json to run the gulpfile.

```json
{
  "scripts": {
    "build": "gulp compile",
    "watch": "gulp watch"
  }
}
```

Once that is done, make sure that all dependencies in you app.functions and extensions folders are in the root level package.json.

After that, you'll want to update the serverless.json file so that all of the functions are pointing to the compiled code.

```json
{
  "appFunctions": {
    "FUNCTION_NAME": {
      "file": "compiled/FUNCTION_FILE.js"
    }
  }
}
```

We recommend keeping your file name the same as your function name for consistency.

Be sure to change all of the .js files in the app.functions folder to .ts files, and update the code accordingly.

This is the template we recommend for the serverless functions:

```typescript
import * as hubspot from "@hubspot/api-client";
import { ServerlessRunnerParams } from "@hubspot/ui-extensions";

interface RunnerParams extends ServerlessRunnerParams {
  parameters: {
    hs_object_id: string;
  };
  propertiesToSend?: never;
  // When exact properties are needed:
  // propertiesToSend: ['test']
}

export const main = async ({ parameters: params }: RunnerParams) => {
  // ... Do code
  return {
    data: any,
    error?: string,
  }
}
```

This makes sure the typing is correct throughout the codebase, as RunnerParams is seen in the useMutation and useQuery functions.

## Adding the Extension Tools

To add the extension tools, you'll want to install the package.

```bash
npm install --save @hubspot/extension-tools
```

After that, you'll want to add an index.ts to the app.functions folder.

```typescript
import { main as FUNCTION_NAME } from "./FUNCTION_FILE";
// Include any more functions here

const serverlessFunctions = {
  FUNCTION_NAME,
} as const;

type ServerlessFunctions = typeof serverlessFunctions;

export default ServerlessFunctions;
```

For the extensions, we follow a specific folder structure. It looks something like this:

```
/extensions
  /extension1
    Extension1.tsx
  /extension2
    Extension2.tsx
  Extension1Extension.ts
  Extension2Extension.ts
  extension-1-card.json
  extension-2-card.json
```

Then in the Extension1Extension.ts file, you'll want to add the following code:

```typescript
import Extension1 from "./extension1/Extension1";
import type ServerlessFunctions from "../app.functions";
import HSExtensionTools from "hs-extension-tools";

export default HSExtensionTools.useExtension<ServerlessFunctions>(Extension1);
```

Once that's done, you're good to go! You can now use the useQuery and useMutation hooks in your extensions.

## useQuery

The useQuery hook is used to fetch data from the serverless functions. It takes in the function name and the parameters for the function.

```typescript
import Extension1 from "../../Extension1";
const { context, actions, useMutation, useQuery } = useExtension();

const query = useQuery(
  "FUNCTION_NAME",
  {
    parameters: {
      hs_object_id: context.crm.objectId.toString(),
      object_type_id: context.crm.objectTypeId,
    },
  },
  {
    runOnCreate: true,
    // You can also add onSuccess and onError functions here
  },
);
```

## useMutation

The useMutation hook is used to send data to the serverless functions. It takes in the function name and the parameters for the function.

```typescript
import Extension1 from "../../Extension1";
const { context, actions, useMutation, useQuery } = useExtension();

const { mutate: mutation } = useMutation("FUNCTION_NAME");
```
