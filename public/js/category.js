var categoryAds = [];
/**
 * Sends a POST request to the given url with the data from the given form.
 */
async function sendFormData(form, url) {
  /* represent form inputs as json */
  let formData = new FormData(form);
  let temp = {};
  for (let [key, value] of formData) {
    temp[key.toLowerCase()] = value;  // why make everything lowercase??
  }
  let json = JSON.stringify(temp);

  /* configure headers and send POST request */
  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  try {
    let response = await fetch(
      url,
      {
        method: 'POST',
        headers: myHeaders,
        body: json
      }
    );
    if (response.ok) {
      let data = await response.json();
      alert(`Login successful!\nUUID: ${data['sessionId']}`);
    } else {
      let errorMessage = await response.json(); // Assuming the error message is sent as JSON
      alert(`Login unsuccessful!\n${errorMessage.error}`);
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert('An error occurred during login. Please try again.');
  }

  form.reset();
}

function getCurrentUsername() {
  
  const username = sessionStorage.getItem('username'); 
  return username;
}

// Function to get the current session ID from the session
function getCurrentSessionId() {

  const sessionId = sessionStorage.getItem('sessionId'); 
  return sessionId;
}
// Function to get ad data by adId
function getAdDataById(adId) {
  
  const adData = categoryAds.find(ad => ad.adId === adId);

  return adData;
}

/**
 * Sends a POST request to the given url specifying which ad will be added to
 * favourites.
 */
async function addToFavorites(adId) {
  try {
    // Obtain the actual username and sessionId from your authentication mechanism
    const actualUsername = getCurrentUsername(); 
    const actualSessionId = getCurrentSessionId(); 

    // Find the ad in categoryAds based on adId
    const adData = getAdDataById(adId);

    // Log the adData for debugging
    console.log('Ad Data:', adData);

    // Check if adData is not null or undefined
    if (adData && adData.adCode) {
      // Check if the ad is already in the user's favorites
      if (!isAdInFavorites(actualUsername, adData.adCode)) {
        // Make a POST request to Add to Favorites Service (AFS)
        const response = await fetch('/add-to-favorites-service', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adCode: adData.adCode,
            title: adData.title,
            description: adData.description,
            cost: adData.cost,
            imageUrl: adData.imageUrl,
            username: actualUsername,
            sessionId: actualSessionId,
          }),
        });

        if (response.ok) {
          // Successful response, handle as needed (e.g., display success message)
          console.log('Added to favorites successfully!');
        } else {
          // Handle error response (e.g., display error message)
          console.error('Failed to add to favorites:', response.status, response.statusText);
        }
      } else {
        // Ad is already in favorites, handle as needed (e.g., display a message)
        console.log('Ad is already in favorites.');
      }
    } else {
      // Handle case where adData is null or undefined
      console.error('Error during adding to favorites: adData is null or undefined');
    }
  } catch (error) {
    console.error('Error in addToFavorites:', error);
  }
}


window.onload = async () => {
  let id = getCategoryId();

  /* see: functions.js */
  await fetchData(`https://wiki-ads.onrender.com/ads?category=${id}`, (data) => {
    categoryAds = data;
  })

  .catch((err) => {
    console.error(err);
  })

  .finally(() => {
    /* modify template */
    let adsTag = document.getElementById('category-ads');
    let templateText = document.getElementById('template').textContent;
    let templateFunc = Handlebars.compile(templateText);
    let htmlContent = templateFunc({
      ads: categoryAds
    });
    adsTag.innerHTML = htmlContent;

    /* form submission is done through the Fetch API */
    let formTag = document.getElementById('login-form');
    formTag.addEventListener('submit', (event) => {
      event.preventDefault();
      sendFormData(formTag, '/login-service');
    });

    /* add-to-favourites buttons also use the Fetch API */
    document.querySelectorAll('.add-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        // Access the adId using data attribute
        const adId = event.target.getAttribute('ad-id');
        // Implement your logic to add the ad to the user's favorites
        await addToFavorites(adId);
      });
    });
  });
};
