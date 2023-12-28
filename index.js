const express = require('express');
const path = require('path');
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
    console.log('Showing request json data:\n', req.body);
  } else if (contentType == 'application/x-www-form-urlencoded') {
    console.log('Showing request urlencoded data', req.body);
  }

  /* this is only here for testing */
  if (Math.random() > 0.5) {
    res.status(201).send('This user is authorized to login\n');
  } else {
    res.status(501).send('Unauthorized user!\n');
  }
});
