### Create app

Run in terminal:

```
npx degit NikolayMakhonin/app-template#node-module <app name> && cd <app name> && npm i
```

### Run app in browser with dev mode

```
npm run sapper:dev
```
Open in browser: http://localhost:3000/app

### Run electron app with dev mode

```
npm run sapper:dev
npm run electron:dev
```

### Create installer

```
npm run build-pack:dev
```
Wait 15 mins and take installer from the `./dist/dev/electron/pack` 
