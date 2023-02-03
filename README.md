## Getting Started

before running this project you will need to install docker
If not already installed use this link [https://docs.docker.com/desktop/](https://docs.docker.com/desktop/)

# The following commands use yarn, but cant use npm too

to start the project type the following commands in order:

- yarn docker:up
- yarn migration:ini
- yarn dev

-- or

use the short command:

- yarn first:init

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tests

Unit tests with jest and e2e cypress

# unit tests (JEST)

To run all the unit tests use the following command

- yarn run:jest

# e2e tests (CYPRESS)

to run all e2e test use the following command

- yarn docker:up (if you haven't already started)
- yarn run:e2e

--or

if what open cypress test

- yarn docker:up (if you haven't already started)
- yarn open:e2e
