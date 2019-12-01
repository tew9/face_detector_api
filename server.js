Register = require('./controller/register.js');
Signin = require('./controller/signin.js');
Profile = require('./controller/profile.js');
Rank = require('./controller/rank.js');
express = require('express');
bcrypt = require('bcrypt-nodejs');
cors = require('cors');
knex = require('knex');

const database = knex({
            client: 'pg',
            connection: {
            connectionString: process.env.DATABASE_URL,
          	ssl:true,
            }
        });

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

//setting up the end points
app.get('/', (req, res) =>{res.send("It's now working well")});//for demo
//app.get('/', (req, res) =>{res.send(database.users)});
//Login Route
app.post('/login', (req, res) => {Signin.SigninHandler(req, res, database, bcrypt)});
//POST registering new users.
app.post('/register', (req, res) => {Register.RegisterHandler(req, res, database, bcrypt)})
//displaying user profile GET
app.get('/profile/:id', (req, res) => {Profile.profileHandler(req, res, database, bcrypt)})
//Updating the rank for the user, PUT
app.put('/rank', (req, res) => {Rank.rankHandler(req, res, database)})
app.post('/imageurl', (req, res) => {Rank.handleApiCall(req, res)})
app.listen(process.env.PORT || 30001, ()=>{
    console.log(`Listening ${process.env.PORT}...`)
})