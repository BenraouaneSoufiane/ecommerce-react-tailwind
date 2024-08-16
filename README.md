# IT Store
Basic IT Store built with Astro & TailwindCSS, only functionalities mentionned in the readme are working
live example: https://itstore.cryptocheckout.co

## Getting started
### installation
```
npm install
```
### Developement
Before start, you may need to change ports in astro.config.mjs, products.tsx, checkout.tsx (api calls endpoint's host port) server.mjs & edit the authorizations like access-allow-origin,...
In first terminal run:
```
npm run dev
```
In second terminal run:
```
node server.mjs
```
### Production
Before start, you may need to change ports in astro.config.mjs, products.tsx, checkout.tsx (api calls endpoint's host port) server.mjs & edit the authorizations like access-allow-origin,...
Add your certificates, the port will be 443 & also 80
In first terminal run:
```
npm run build
node server.mjs
```
If you'de like to run it definitively run it with nohup & pm2

## Enjoy :)