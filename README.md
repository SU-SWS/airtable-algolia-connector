# Airtable / Algolia Connector Proxy

This website allows the Algolia JSON API connector to connect to an Airtable API through basic authentication. The Airtable API supports API tokens but the Algolia connector only supports basic auth. This proxy website bridges that gap so Algolia can consume Airtable data.


## Airtable

Airtable's documenation and information on each of the bases you have access to can be found on [Airtable's developer documentation website](https://airtable.com/developers/web/api/introduction).


## Algolia

Connector documentation and requirements can be found in [Algolia's documentation](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-no-code-connectors/).


## Environment variable set up and installation

_Development_

1. Create a new `.env` file by cloning the `example.env` file provided:
`cp example.env .env`
2. Manually find and add the `VAULT_ROLE_ID` and `VAULT_ROLE_ID` to `.env`. You can likely find those values in the Netlify environment variables UI.
Or, you can retrieve the `VAULT_ROLE_ID` and `VAULT_ROLE_ID` by first running `netlify login` then `netlify link`, then use the `netlify env:get VAR_NAME` command. After that manually add them to `.env`
If you can't find them, please ask another developer on the team.
3. After the `VAULT_ROLE_ID` and `VAULT_SECRET_ID` environment variables have been added to .env, retrieve all other environment variables from the vault:
`npm run vault:local`
4. Install packages using `npm ci` or `npm install`
5. Then fire up your development server using Next.js
`npm run dev`

We use the netlify-plugin-vault-variables to fetch the correct environment variables from the vault. For more information, please see:
https://github.com/SU-SWS/netlify-plugin-vault-variables/#environment-variable-strategy-with-vault
