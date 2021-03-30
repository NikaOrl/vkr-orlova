# VkrOrlova

## Running DB

1. Set your local DB according to `env/db.config`
2. Run `npm tables:create` to create all the necessary tables
3. Run `npm tables:insert` to insert tables with start data

## Development server

1. Run `npm start` to start FE part that will be running on the `http://localhost:4200/`. The app will automatically reload if you change any of the source files;
2. Run `npm start:be` to start BE part that will be running on the `http://localhost:3000/api`. If you ran `npm build` before, you can find built FE app on `http://localhost:3000`

## Register

To login you have to be registred

1. Using Postman or any other tools send a following request

   POST `http://localhost:3000/api/register`

   HTTP Headers:

```
{
  "Content-Type": "application/json"
}
```

Body:

```
{
	"firstName": "admin",
	"lastName": "admin",
	"email": "admin@gmail.com",
	"password": "admin",
	"isAdmin": 1
}
```

Now you can login with:

email: "admin@gmail.com";

password: "admin".

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
