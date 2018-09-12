# ExpressHar

Use har files to mock/stub a backend locally for development.

## Usage

* `yarn install`
* grab a har file by clicking around a live environment while recording the network requests
* save as `localhost.har`
* add har file to `__har__` dir
* run a frontend that is proxying to `http://localhost:4242`
* `npm start`

## Extending / Customizing

* simply add new express routes that will override the wildcard routes
* send back whatever response you need