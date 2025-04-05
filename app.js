const express=require('express');
const { engine } = require('express-handlebars');
const bodyParser=require('body-parser'); //it is a parsing middleware (pass json data)

require('dotenv').config();

const app=express();
const port=process.env.PORT || 5000;



//parsing middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));

//parse application/json
app.use(bodyParser.json())

//.static to serve static files like html,css and js
app.use(express.static('public'));   

//Templating Engine
app.engine('hbs', engine({extname: '.hbs'})); //now we can use .hbs instead of .handlebars
app.set('view engine','hbs');


const mysql = require('mysql2/promise');

(async () => {
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true, // Ensures connection requests wait for an available connection
      queueLimit: 0, // No limit to the number of queued connection requests
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log('Connected to the database as ID ' + connection.threadId);

    // Release the connection back to the pool
    connection.release();

    // Close the pool when the app shuts down (optional)
    process.on('SIGINT', async () => {
      console.log('Closing database connection pool...');
      await pool.end();
      console.log('Database connection pool closed.');
      process.exit(0);
    });

  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
})();



const routes=require('./server/routes/user');
app.use('/',routes);

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})