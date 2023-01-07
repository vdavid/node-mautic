# cf-woker-mautic
A Cloudflare Worker Friendly Mautic API implemented with ES6 + async/await.

Based on
 - NPM: https://www.npmjs.com/package/node-mautic
 - GitHub: https://github.com/vdavid/node-mautic/

Tested with wrangler2 and Mautic 4.4.5.

~~This package has only 1 dependency ([node-fetch](https://github.com/node-fetch/node-fetch)), which has 0 dependencies.~~
This package now has 0 dependancies.

## Installation

```bash
$ npm install cf-worker-mautic
```

## Usage

1. Import the class

   ```javascript
   import MauticConnector from "node-mautic";
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
   
    ```javascript
    await mautic.contacts.createContact({
    mobile: phone,
		tags: ["tag1","tag2"]
   })
   ```
   
    ```javascript
    mautic.contacts.queryContacts(
        {
          // "email": "email@domain.com",
          // "mobile": encodeURIComponent(phone),
        },
    ).then((response) => {
    console.log(JSON.stringify(response, null, 2))
    });
   ```   
   
   
4. Run or deploy

   To try it out:
   ```bash
   $ wrangler2 dev
   ```
   To deploy it:
   ```bash
   $ wrangler2 publish --name name-of-the-worker
   ```


## Features

 - uses basic authentication
 - has methods for all ~200 documented API endpoints
 - has less than 400 lines of code
 - uses async/await (no callback hell) 
 - some documentation
 - 6 Jest tests


## Based On

 - NPM: https://www.npmjs.com/package/node-mautic
 - GitHub: https://github.com/vdavid/node-mautic/

## Tests

To run the tests, fill the `apiUrl`, `username`, and `password` fields in `MauticConnector.i.test.js`. 
## Thanks

 - To https://github.com/vdavid/node-mautic/ for the original code!
