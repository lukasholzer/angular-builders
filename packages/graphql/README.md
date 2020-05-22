# Apollo GraphQl builder

This angular builder is using the [graphql-code-generator](https://graphql-code-generator.com/) to generate apollo services for your angular application.

## installation

First of all you need to install the builder package.

```bash
npm install -D @ng-builder/graphql
```

Then you have to configure it in the `angular.json`

```json
...
{
  "version": 1,
  "projects": {
    "your-app": {
      "projectType": "application",
      "root": "apps/your-app",
      "sourceRoot": "apps/your-app/src",
      "prefix": "ya",
      "architect": {
        ...
        "build": {...},
        "graphql": {
          "builder": "@ng-builder/graphql:build",
          "options": {
            "schema": "https://swapi-graphql.netlify.com/.netlify/functions/index",
            "documents": "apps/your-app/src/**/*.graphql",
            "outputPath": "apps/your-app/src/graphql-models",
            "declarationFile": "types.d.ts"
          },
          "configurations": {
            "watch": {
              "watch": true
            }
          }
        }
      }
    }
  }
}
```

after you have configured the `angular.json` you can go ahead with `ng run your-app:graphql --configuration="watch"`
This is generating under the specified directory a barrel file that exports all generated apollo services.
