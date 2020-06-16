# Universal builders

This builder is used as addition to the `@nguniversal` package.

As you might think what is the difference to the `@nguniversal/builders:prerender` builder from the official Univesal package?

Short it is a "prerender" and not a full render of the page, so they do not spawn a local webserver and getting the rendered output of the express server instead they only compile with the angular compiler. Furthermore it is not possible with the official builder to leverage any kind of server side providers that are injected by the express server. It won't work for more complex applications so this package should help you out!

## installation

First of all you need to install the builder package.

```bash
npm install -D @ng-builder/universal
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
        "build-server": {...},
        "static-pages": {
          "builder": "@ng-builder/universal:static-pages",
          "options": {
            "browserTarget": "your-app:build:production",
            "serverTarget": "your-app:build-server:production",
            "outputPath": "dist/apps/your-app/static-pages",
            "routesFile": "routes.txt"
          }
        }
      }
    }
  }
}
```

after you have configured the `angular.json` you can go ahead with `ng run your-app:static-pages`
This is spawning your universal setup and generating static pages out of the specified routes.
