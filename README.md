# SearchSECO-API

This API contains the essential endpoints and modules to pull, parse and check a project against the SecureSECO database.
This README is still incomplete and will ben expanded upon later.

# Installation Guide

-   Make sure `npm` and `node v18` are installed
-   In the root directory, run `npm i`
-   Copy the contents of `.env.example` to a `.env` file, and specify the port and host of the database
-   Run the server using `npm run start`

# User Manual

Currently there are two endpoints exposed.

-   `/fetch`: This is a `POST` request pulling and parsing a given url. The request body looks as follows:

```
{
  "url": <github_url>,
  "token": <github_token>,
  "wallet": <wallet_address>
}
```

The response of this endpoint has the following structure:

```
{
  <filename>: {
    "Hash": ...,
    "FileName": ...,
    "FunctionName": ...,
    "LineNumber": ...,
    "LineNumberEnd": ...
  },
  <filename>: { ... },
  ...
}
```

-   `/check`: This is a `POST` request checking an array of hashes against the database. The request body looks as follows:

```
{
  "hashes": [ ... ],
  "wallet": <wallet_address>
}
```

The response of this endpoint has the following structure:

```
{
  "responseCode": ...
  "requestType": ...
  "response": [ ... ]
}
```

## Monetization (paying for hash data)

This feature is gonna allow users to pay monetary tokens in exchange for SearchSECO queries.
This server acts as a middleman between the DAO web app & database API. The process is as follows:

1. Client asks for hashes

2. Pays via smart contract

3. This server checks payment

4. Server retrieves data from DB API

5. Data is returned to client

### Endpoints

#### POST `/cost`

This endpoint returns the cost of retrieving data from a GitHub repository.

##### Request body

```
{
  "url": <github_repo_url>,
  "token": <github_token>,
}
```

##### Response body

```
{
  "status": <status>,
  "cost": <cost>,
  "hashes": <list of method hashes in repo>
}
```

#### POST `/startSession`

This endpoint starts a session for the user. A session keeps track of the user's payment and the data they are requesting.

##### Request body

```
{
  "hashes": <list of method hashes in repo>,
}
```

The "hashes" property should be the same list of hashes returned by the `/cost` endpoint.

##### Response body

```
{
  "status": <status>,
  "sessId": <session_id>,
  "secret": <session_secret>,
}
```

#### GET `/getData`

This endpoint returns the data requested by the user.

##### Query parameters

```
sessId=<session_id>
secret=<session_secret>

```

Why is a secret required? The session ids are emitted in an event on the blockchain, which means that anyone can see them. The secret is a random string that is only known to the user and the server. This way, the server can verify that the user is the one who started the session.

##### Response body

```
{
  "status": <status>,
  "data": <hash_data>,
  "fetch_status": <fetch_status>,
}
```

## Rewarding (getting paid for hash data)

This feature is gonna allow users to get paid in reputation and/or monetary tokens in exchange for SearchSECO queries.

#### POST `/reward`

This endpoint allows users to claim their reward for submitting hashes.

##### Request body

```
{
  "hashes": <list of hashes the user wants to submit>,
  "address": <what address to reward>
}
```

##### Response body

```
{
  "status": <status>,
  "proof": <proof that can be used with smart contract>
}
```

# Testing

We use (Jest)[https://jestjs.io/] for testing. The tests for the API endpoints are located in the `src/test` folder, and the tests for the parser are located in the `tests/parser` folder.

## Env file

At the root level, create a file called .env.test.local. See .env.test.local.example to see what should be in it.

## Running the tests

To run the tests, run `npm run test`. Note that this runs the tests in silent mode, so you won't see any output. To see the output, run `npm run test-verbose`.

# License

This project is licensed under the MIT license. See [LICENSE](/LICENSE) for more info.

This program has been developed by students from the bachelor Computer Science at
Utrecht University within the Software Project course. © Copyright Utrecht University
(Department of Information and Computing Sciences)
