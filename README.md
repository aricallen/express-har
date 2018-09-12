# MockBackend

## Usage

* grab a har file from logging in and clicking around localhost
* save as `localhost.har`
* add har file to `__har__` dir
* run a frontend that is proxying to `http://localhost:4242`

## Extending / Customizing

* simply add new express routes that will override the wildcard routes
* send back whatever response you need