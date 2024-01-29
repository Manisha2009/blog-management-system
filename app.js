require('dotenv').config();
const express=require('express');
const expressLayout=require('express-ejs-layouts');
const methodOverride=require('method-override');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const MongoStore=require('connect-mongo');

const connectDB=require('./server/config/db');
const {isActiveRoute} =require('./server/helpers/routeHelper');

//add expressEjsLayouts
const app=express();
const PORT=5000||process.env.PORT;

//connect to DB
connectDB();


//In order to pass the data use this---
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}))
app.use(express.static('public'));
//Templating Engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.locals.isActiveRoute = isActiveRoute; 

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`App is listening on port ${PORT}`);
    });
})