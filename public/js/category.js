var categoryAds = [];

/**
 * Sends a POST request to the given url with the data from the given form.
 */
async function sendFormData(form, url) {
  try {
    /* represent form inputs as json */
    let formData = new FormData(form);
    let temp = {};
    for (let [key, value] of formData) {
      temp[key] = value;
    }
    let json = JSON.stringify(temp);

    /* configure headers and send POST request */
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let response = await fetch(
      url,
      {
        method: 'POST',
        headers: myHeaders,
        body: json
      }
    );

    // Check if response has JSON content type
    if (response.headers.get('content-type') && response.headers.get('content-type').includes('application/json')) {
      // Try to parse JSON even for error cases
      let data = await response.json();

      if (response.ok) {
        alert(`Login successful!\nUUID: ${data['sessionId']}`);
      } else {
        if (data.error) {
          alert(`Login unsuccessful!\n${data.error}`);
        } else {
          alert(`Login unsuccessful!\nUnexpected error: ${response.statusText}`);
        }
      }
    } else {
      // If not JSON, handle the response based on the status code
      if (response.status === 401) {
        alert('Login unsuccessful!\nUnauthorized user!');
      } else {
        alert(`Login unsuccessful!\nUnexpected error: ${response.statusText}`);
      }
    }

    form.reset();
  } catch (error) {
    console.error(error);
    alert('An unexpected error occurred!\nPlease try again later.');
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
  });
};
