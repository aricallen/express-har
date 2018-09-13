# ExpressHar

Use har files to mock/stub a backend locally for development.

## Setup

* `yarn install`
* grab a har file by clicking around a live environment while recording the network requests
* save file to `__har__` dir
* run a frontend that is proxying to this backend (defaults to port 4242)

## Usage

`node server.js --filename=<har-filename> [--port=<port>]`

## Extending / Customizing

* simply add new express routes that will override the wildcard routes
* send back whatever response you need

## Troubleshooting

* custom login endpoints / logic may need to be added per project
* its best to login while recording the har file so a session cookie can be set
* make sure the har file is valid JSON