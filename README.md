# searchSECO-api
This API contains the essential endpoints and modules to pull, parse and check a project against the SecureSECO database.
This README is still incomplete and will ben expanded upon later.

# Installation Guide
- Make sure `npm` and `node v18` are installed
- In the root directory, run `npm i`
- Copy the contents of `.env.example` to a `.env` file, and specify the port and host of the database
- Run the server using `npm run start`
# User Manual
Currently there are two endpoints exposed.
- `/fetch`: This is a `POST` request pulling and parsing a given url. The request body looks as follows:
```
{
  "url": <github_url>,
  "token: <github_token>,
  "wallet: <wallet_address>
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
- `/check`: This is a `POST` request checking an array of hashes against the database. The request body looks as follows:
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
