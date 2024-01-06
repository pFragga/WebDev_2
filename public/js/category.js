var categoryAds = [];

/**
 * Sends a POST request to the given url with the data from the given form.
 */
async function sendFormData(form, url) {
  /* represent form inputs as json */
  let formData = new FormData(form);
  let temp = {};
  for (let [key, value] of formData) {
    temp[key.toLowerCase()] = value;
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
    // Add event listener for "Add" button
    document.querySelectorAll('.add-button').forEach(button => {
      button.addEventListener('click', (event) => {
        // Access the adId using data attribute
        const adId = event.target.getAttribute('data-ad-id');
        // Implement your logic to add the ad to the user's favorites
        console.log(`Add button clicked for adId: ${this.adId}`);
      });
    });
  });
};