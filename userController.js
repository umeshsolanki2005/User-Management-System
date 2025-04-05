const mysql = require('mysql2/promise');

// View users
exports.view = async (req, res) => {
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0,
    });

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      console.log('Connected to the database as ID ' + connection.threadId);

      // Query the database
      const [rows] = await connection.query('SELECT * FROM user');

      // Render the result to the view
      let removedUser =req.query.removed;
      res.render('home', { rows, removedUser });
      console.log('The data from the user table:\n', rows);
    } catch (queryError) {
      console.error('Error executing the query:', queryError.message);
      res.status(500).send('Error fetching data from the database.');
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (poolError) {
    console.error('Error connecting to the database:', poolError.message);
    res.status(500).send('Database connection error.');
  }
};


//a function to find user by search
exports.find= async (req, res) => {
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0,
    });

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      console.log('Connected to the database as ID ' + connection.threadId);
      
      let searchTerm=req.body.search;
      // Query the database
      const [rows] = await connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',['%'+searchTerm+ '%', '%'+searchTerm+ '%']);

      // Render the result to the view
      res.render('home', { rows });
      console.log('The data from the user table:\n', rows);
    } catch (queryError) {
      console.error('Error executing the query:', queryError.message);
      res.status(500).send('Error fetching data from the database.');
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (poolError) {
    console.error('Error connecting to the database:', poolError.message);
    res.status(500).send('Database connection error.');
  }
}

//for rendering form
exports.form=(req, res) => {
  res.render('adduser')
}


//function to add new user
exports.create= async(req, res) => {
  const {Id,First_Name, Last_Name, Email, phone, Comments}=req.body;
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0,
    });

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      console.log('Connected to the database as ID ' + connection.threadId);
      
      let searchTerm=req.body.search;
      // Query the database
      const [rows] = await connection.query('INSERT INTO  user SET Id=?,First_Name=?,Last_Name=?,Email=?,phone=?,Comments=?',[Id,First_Name, Last_Name,Email,phone,Comments],);

      // Render the result to the view
      res.render('adduser', { alert: 'User added successfully' });
      console.log('The data from the user table:\n', rows);
    } catch (queryError) {
      console.error('Error executing the query:', queryError.message);
      res.status(500).send('Error fetching data from the database.');
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (poolError) {
    console.error('Error connecting to the database:', poolError.message);
    res.status(500).send('Database connection error.');
  }
}

//function to edit informtion user
exports.edit= async(req, res) => {
//const {Id,First_Name, Last_Name, Email, phone, Comments}=req.body;

try {
  // Create a connection pool
  const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0,
  });

  // Get a connection from the pool
  const connection = await pool.getConnection();

  try {
    console.log('Connected to the database as ID ' + connection.threadId);
    
    console.log('Fetching user with ID:', req.params.id);
    // Query the database
    const [rows] = await connection.query('SELECT * FROM user WHERE Id=?',[req.params.id]);
   
    // Render the result to the view
    res.render('edit-user', { user: rows[0]});
    console.log('The data from the user table:\n', rows);
  } catch (queryError) {
    console.error('Error executing the query:', queryError.message);
    res.status(500).send('Error fetching data from the database.');
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
} catch (poolError) {
  console.error('Error connecting to the database:', poolError.message);
  res.status(500).send('Database connection error.');
}

}


//update user
exports.update= async(req, res) => {

const {First_Name, Last_Name, Email, phone, Comments}=req.body;
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0,
    });
  
    // Get a connection from the pool
    const connection = await pool.getConnection();
  
    try {
      console.log('Connected to the database as ID ' + connection.threadId);
      
      // Query the database
      const [rows] = await connection.query('UPDATE user SET First_Name=?,Last_Name=?,Email=?,phone=?,Comments=? Where Id=?',[First_Name,Last_Name,Email,phone,Comments,req.params.id]);
     
      // Render the result to the view
      res.render('edit-user', { rows, alert: `${First_Name} Details has been updated successfully`});
      console.log('The data from the user table:\n', rows);
    } catch (queryError) {
      console.error('Error executing the query:', queryError.message);
      res.status(500).send('Error fetching data from the database.');
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (poolError) {
    console.error('Error connecting to the database:', poolError.message);
    res.status(500).send('Database connection error.');
  }
  
  
  }

  //function to delete user
exports.delete= async(req, res) => {

  
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0,
    });
  
    // Get a connection from the pool
    const connection = await pool.getConnection();
  
    try {
      console.log('Connected to the database as ID ' + connection.threadId);
      
      console.log('Fetching user with ID:', req.params.id);
      // Query the database
      const [rows] = await connection.query('DELETE FROM user WHERE Id=?',[req.params.id]);
     
      // Render the result to the view
      let removedUser =encodeURIComponent('User Successfully removed');
      res.redirect('/?removed='+ removedUser);
      console.log('The data from the user table:\n', rows);
    } catch (queryError) {
      console.error('Error executing the query:', queryError.message);
      res.status(500).send('Error fetching data from the database.');
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (poolError) {
    console.error('Error connecting to the database:', poolError.message);
    res.status(500).send('Database connection error.');
  }
  
  }

  // View users
exports.viewall = async (req, res) => {
  try {
    // Create a connection pool
    const pool = mysql.createPool({
      connectionLimit: 100,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      queueLimit: 0,
    });

    // Get a connection from the pool
    const connection = await pool.getConnection();

    try {
      console.log('Connected to the database as ID ' + connection.threadId);

      // Query the database
      const [rows] = await connection.query('SELECT * FROM user WHERE id=?' ,[req.params.id]);

      // Render the result to the view
      res.render('view-user', { rows });
      console.log('The data from the user table:\n', rows);
    } catch (queryError) {
      console.error('Error executing the query:', queryError.message);
      res.status(500).send('Error fetching data from the database.');
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (poolError) {
    console.error('Error connecting to the database:', poolError.message);
    res.status(500).send('Database connection error.');
  }
};