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

// AFS Add to Favourites
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

// Validation function for user identification
function validateUser(username, sessionId) {
  // Find the user in the in-memory array
  const user = usersArr.find(u => u.userName === username);
  
  // Check if the user exists and the provided sessionId matches the stored sessionId
  return user && user.sessionId === sessionId;
}

// Function to check if the ad is already in the user's favorites
function isAdInFavorites(username, adCode) {
  // Find the user in the in-memory array
  const userIndex = usersArr.findIndex(u => u.userName === username);

  // Check if the user exists and if the ad is in favorites
  return userIndex !== -1 && usersArr[userIndex].favorites.some(ad => ad.adCode === adCode);
}

// Function to add the ad to the user's favorites
function addToFavorites(username, adCode, title, description, cost, imageUrl) {
  // Find the user in the in-memory array
  const userIndex = usersArr.findIndex(u => u.userName === username);

  // Check if the user exists
  if (userIndex !== -1) {
    // Check if the ad is not already in favorites
    const adIndex = usersArr[userIndex].favorites.findIndex(ad => ad.adCode === adCode);
    if (adIndex === -1) {
      // Add the ad to the user's favorites
      usersArr[userIndex].favorites.push({
        adCode,
        title,
        description,
        cost,
        imageUrl,
      });
    }
  }
}