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

/* add-to-favorites service */
app.post('/add-to-favorites', function(req,res) {
  let contentType = req.header('Content-Type');
  if (contentType === 'application/json') {
    console.log('Request json data:\n', req.body);
  } else if (contentType == 'application/x-www-form-urlencoded') {
    console.log('Request urlencoded data:\n', req.body);
  }

  const data = req.body;

  /* is the user logged in? */
  let user = usersDAO.getUserBySessionId(data.sessionId);
  if (user) {
    /* does the user's favorites list already contain the selected ad? */
    if (user.favorites.every((ad) => ad.id != data.id)) {
      user.favorites.push({
        id: data.id,
        title: data.title,
        description: data.description,
        cost: data.cost,
        imageUrl: data.imageUrl
      });

      /* ensure the user's favorites list changes */
      console.log(`${user.userName}'s favorites:`);
      user.favorites.forEach((item) => console.log(item));

      res.status(201).send(JSON.stringify({ msg: `Added ad #${data.id} to favorites.` }));
    } else {
      res.status(202).send(JSON.stringify({ msg: `Ad #${data.id} already in favorites.` }));
    }
  } else {
    res.status(401).send(JSON.stringify({ error: 'You need to be logged in.' }));
  }
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

/* favorites retrieval service */
app.post('/favorites', function(req, res) {
  let contentType = req.header('Content-Type');
  if (contentType === 'application/json') {
    console.log('Request json data:\n', req.body);
  } else if (contentType == 'application/x-www-form-urlencoded') {
    console.log('Request urlencoded data:\n', req.body);
  }

  const username = req.body['username'];
  const sessionId = req.body['sessionId'];

  let user = usersDAO.getUserBySessionId(sessionId);
  if (user) {
    res.status(200).send(JSON.stringify({ favorites: user.favorites }));
  } else {
    res.status(404).send(JSON.stringify({ error: 'Could not get user favorites.' }));
  }
});
