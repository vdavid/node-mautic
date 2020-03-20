# node-mautic
A Node.js Mautic API implemented with ES6 + async/await. Tested with Node 10.

## Installation

```bash
$ npm install node-mautic
```

## Usage

1. Require the class: `const MauticConnector = require('node-mautic');

2. Instantiate an object: `const mauticConnector = new MauticConnector({apiUrl: 'https://your-url.com', username: '...', password: '...' , timeoutInSeconds: 5});`

  - `apiURL` needs to be just the base URL, so the `/url/` part or anything else is not needed.
  - `username` and `password` are just a normal Mautic user's username and password. There are no separate API users in Mautic.
  - `timeoutInSeconds` is optional.

3. Make calls: `const campaigns = (await mauticConnector.campaigns.listCampaigns()).campaigns;`



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
 
## Thanks

 - To https://github.com/sambarnes90/node-mautic/ for the code I started from
 - To my company [CodeBerry](https://codeberryschool.com) that allowed me to do this work and open-source it.
