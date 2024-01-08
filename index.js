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
  console.log(req.body); // this is dumb

  res.sendFile('index.html', options, function(err) {
    console.err(err);
  });
});

// AFS Add to Favorites
app.post('/add-to-favorites', function(req,res) {
  let {adCode,title,description,cost,imageUrl,username,sessionId} = req.body;

  // Validate user identification
  if (!validateUser(username, sessionId)) {
    /* 401 Unauthorized */
    return res.status(401).json({ error: 'Please log in to add to favorites.' });
  }
  // Check if the ad is already in the favorites list
  if (isAdInFavorites(username, adCode)) {
    /* 409 Conflict - Already in favorites */
    return res.status(409).json({ error: 'Ad is already in favorites.' });
  }
  // Add the ad to the favorites list (you need to implement this function)
  addToFavorites(username, adCode, title, description, cost, imageUrl);
  /* 201 Created - Successfully added to favorites */
  res.status(201).json({ message: 'Ad added to favorites successfully.' });
});

/* login service */
app.post('/login-service', function(req, res) {
  let contentType = req.header('Content-Type');
  if (contentType === 'application/json') {
    console.log('Request json data:\n', req.body);
  } else if (contentType == 'application/x-www-form-urlencoded') {
    console.log('Request urlencoded data:\n', req.body);
  }

  const username = req.body['Username'];
  const password = req.body['Password'];

  if (usersDAO.getUser(username, password)) {
    if (!usersDAO.isActive(username, password)) {
      let uuid = uuidv4();
      usersDAO.setActive(username, password, uuid);
      /* 201 Created: user logged in */
      res.status(201).send(JSON.stringify({ sessionId: uuid }));
    } else {
      /* 202 Accepted: user already logged in */
      res.status(202).send(JSON.stringify({ msg: 'Already logged in.' }));
    }
  } else {
    /* 401 Unauthorized: could not verify user */
    /* see: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes */
    res.status(401).send(JSON.stringify({ error: 'Unauthorized user!' }));
  }
});
