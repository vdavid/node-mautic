# node-mautic
A Node.js Mautic API implemented with ES6 + async/await.

Tested with Node 14 and Mautic 3.1.2.
(Should work with Node 10 and Mautic 2.7.x as well.)

This package has only 1 dependency ([node-fetch](https://github.com/node-fetch/node-fetch)), which has 0 dependencies.

## Installation

```bash
$ npm install node-mautic
```

## Usage

1. Require the class

   ```javascript
   const MauticConnector = require('node-mautic');
   ```

2. Instantiate the object

   ```javascript
   const mauticConnector = new MauticConnector({
       apiUrl: 'https://your-url.com',
       username: '...',
       password: '...' ,
       timeoutInSeconds: 5
   });
   ```

    - `apiURL` needs to be just the base URL. The `/url/` part of the API URL is to be omitted here.
    - `username` and `password` are just a normal Mautic user's username and password. There are no separate API users in Mautic.
    - `timeoutInSeconds` is optional.

3. Make calls

   Example:

   ```javascript
   const campaigns = (await mauticConnector.campaigns.listCampaigns()).campaigns;
   ```

## Features

 - uses basic authentication
 - has methods for all ~200 documented API endpoints
 - has less than 400 lines of code
 - uses async/await (no callback hell) 
 - some documentation
 - 6 Jest tests


## Links

 - NPM: https://www.npmjs.com/package/node-mautic
 - GitHub: https://github.com/vdavid/node-mautic/

## Tests

To run the tests, fill the `apiUrl`, `username`, and `password` fields in `MauticConnector.i.test.js`. 
## Thanks

 - To https://github.com/sambarnes90/node-mautic/ for the code I started from
 - To my company [CodeBerry](https://codeberryschool.com) that allowed me to do this work and open-source it.
