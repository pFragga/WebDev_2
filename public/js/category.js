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

/**
 * Sends a POST request to the given url specifying which ad will be added to
 * favourites.
 */
async function addToFavorites(id, url) {
  // TODO: this + backend implementation of '/add-to-favourites'
  console.log('Added ' + id + ' to favourites.');
  const adData = getAdDataById(adId); // You need to implement this function

  // Fetch API to call the AFS service
  try {
    let response = await fetch(
      '/add-to-favorites',
      {
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
          username: username, // Provide the actual username here
          sessionId: sessionId, // Provide the actual sessionId here
        }),
      }
    );
    if (response.ok) {
      let data = await response.json();
      console.log(data.message);
    } else {
      let errorMessage = await response.json();
      console.error(errorMessage.error);
    }
  } catch (error) {
    console.error('Error during adding to favorites:', error);
  }
}
// Function to get ad data by adId
function getAdDataById(adId) {
  // Find the ad in the categoryAds array
  const ad = categoryAds.find(a => a.adId === adId);

  // Return the ad data or null if not found
  return ad || null;
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
