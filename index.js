const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const UsersDAO = require('./models/dao/usersDAO');
const app = express();
const port = 8080;
const usersDAO = new UsersDAO();

app.listen(port);

/**
 * Serve static content from directory 'public', it will be accessible under
 * path '/', e.g. http://localhost:8080/index.html
 */
app.use(express.static('public'));

/* middleware: enable parsing for json and url-encoded content */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* serve index.html as content root */
app.get('/', function(req, res) {
  var options = {
    root: path.join(__dirname, 'public')
  };

  res.sendFile('index.html', options, function(err) {
    console.err(err);
  });
});

/* login service */
app.post('/login-service', function(req, res) {
  let contentType = req.header('Content-Type');
  if (contentType === 'application/json') {
    console.log('Request json data:\n', req.body);
  } else if (contentType == 'application/x-www-form-urlencoded') {
    console.log('Request urlencoded data:\n', req.body);
  }

  const { username, password } = req.body;
  console.log('Received credentials:', username, password);

  // Validate user credentials using the UsersDAO
  if (usersDAO.isRegistered(username, password)) {
    let temp = { sessionId: uuidv4() };
    /* 201 Created */
    res.status(201).send(JSON.stringify(temp));
  } else {
    /* 406 Not Acceptable */
    res.status(406).json({ error: 'Unauthorized user!' });
  }
});