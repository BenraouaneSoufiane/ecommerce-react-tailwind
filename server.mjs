import https from 'https';
import http from 'http';
import fs from 'fs';
import express from 'express';
import { handler as ssrHandler } from './dist/server/entry.mjs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('crt.pem'),
    ca: fs.readFileSync('bundle.pem')
};
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Change this based on your astro.config.mjs, `base` option.
// They should match. The default value is "/".
const base = '/';
app.use(base, express.static('dist/client/'));
app.use(ssrHandler);
app.get('/products',async(req,res)=>{
   const products = await fs.readFileSync('products.json');
   res.set('Content-Type', 'application/json');
   res.set('Access-Control-Allow-Origin', '*');
   res.send(products);
});
app.get('/cart',async(req,res)=>{
    let cart = await fs.readFileSync('cart.json');
    cart = JSON.parse(cart)[req.cookies.userId]
    console.log(cart);

    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.set('Access-Control-Allow-Credentials', true);
    res.send(cart);
 });
app.get('/product',async(req,res)=>{
    const products = await fs.readFileSync('products.json');

console.log(JSON.parse(products)[req.query.id]);
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(products)[req.query.id]);
 });
app.post('/addtocart',async(req,res)=>{
    var cart = await fs.readFileSync('cart.json');
    var result = false;
    var msg = 'An error occured, it may already added';
    cart = JSON.parse(cart);
    
    if(cart[req.cookies.userId]){
        if(cart[req.cookies.userId].indexOf(req.body.productId)<0){
            cart[req.cookies.userId].push(req.body.productId);
            result = true;
            msg = 'Product were added successfully';
        }
    }else{
        cart[req.cookies.userId]=[req.body.productId];
    }
    await fs.writeFileSync('cart.json',JSON.stringify(cart,null,4));
    
    
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.set('Access-Control-Allow-Credentials', true);
    res.send(JSON.stringify({"result":result,"msg":msg}));
 }); 
 app.post('/submitorder',async(req,res)=>{
    var orders = await fs.readFileSync('orders.json');
    var cart = await fs.readFileSync('cart.json');
    var result = false;
    var msg = 'An error occured, ensure you\'ve filled all fields';
    orders = JSON.parse(orders);
    cart = JSON.parse(cart);
    
    if(req.cookies.userId){
       if(cart[req.cookies.userId]){
        if(req.body['first-name'] && req.body['last-name'] && req.body.email && req.body.country && req.body['street-address'] && req.body.city && req.body.region && req.body.zip ){
            orders.push({userDetails: req.body, cartDetails: cart[req.cookies.userId], time: Date().toString()});
            delete cart[req.cookies.userId];
            await fs.writeFileSync('orders.json',JSON.stringify(orders,null,4));
            await fs.writeFileSync('cart.json',JSON.stringify(cart,null,4));

            result = true;
            msg = 'Order were placed succussfully';
          }
       }else{
        var msg = 'Nothing to order, your cart is empty';
       } 
      
    }else{
        var msg = 'An error occured, we couldn\'t identifying you';
    }
    
    
    res.set('Content-Type', 'application/json');
    res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.set('Access-Control-Allow-Credentials', true);
    res.send(JSON.stringify({"result":result,"msg":msg}));
 }); 
//app.listen(80);
//var server = https.createServer(options,app);
var server = http.createServer(app);
server.listen(3007);