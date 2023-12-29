const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 8080;

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

  /* TODO: validate user credentials */
  let valid = true;

  if (valid) {
    let temp = { sessionId: uuidv4() };

    /* 201 Created */
    res.status(201).send(JSON.stringify(temp));
  } else {
    /* 406 Not Acceptable */
    res.status(406).send('Unauthorized user!\n');
  }
});
