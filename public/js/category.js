/* this is terrible design choice that I am conciously making. */
var username = '';
var uuid = '';
var categoryAds = [];

/**
 * Sends a POST request to the given url with the credentials from the given
 * form. The url's response determines whether the login was successful or not.
 */
async function attemptLogin(form, url) {
  /* represent credentials as json */
  let formData = new FormData(form);
  let temp = {};
  for (let [key, value] of formData) {
    if (key == 'Username') {
      username = value;
    }
    temp[key] = value;
  }
  let json = JSON.stringify(temp);

  try {
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

    /* handle server response */
    let data = await response.json();
    if (response.ok) {
      uuid = data.sessionId;
      if (uuid) {
        alert(`Login successful!\nUUID: ${uuid}`);
      } else {
        alert(data.msg);
      }
    } else {
      alert(`Login unsuccessful!\n${data.error}`);
    }
  } catch (error) {
    console.error(error);
  }

  form.reset();
}

/**
 * Sends a POST request to the given url specifying which ad will be added to
 * favorites.
 */
async function addToFavorites(id, url) {
  /* get data from the category ad with the provided id */
  const adData = categoryAds.find((ad) => ad.id == id);

  try {
    /* send POST request with ad data together with username and uuid */
    let response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: adData.id,
          title: adData.title,
          description: adData.description,
          cost: adData.cost,
          imageUrl: adData.images[0],
          username: username,
          sessionId: uuid,
        }),
      }
    );

    /* handle server response */
    let data = await response.json();
    if (response.ok) {
      alert(data.msg);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error in addToFavorites:', error);
  }
}

window.onload = async () => {
  let id = getUrlParam('id');

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
      attemptLogin(formTag, '/login-service');
    });

    /* add-to-favorites buttons also use the Fetch API */
    document.querySelectorAll('.add-button').forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        // Access the adId using data attribute
        const adId = event.target.getAttribute('ad-id');
        // Implement your logic to add the ad to the user's favorites
        await addToFavorites(adId, '/add-to-favorites');
      });
    });

    /* append username and sessionId to the href that links to favorites */
    let favlink = document.getElementById('fav-link');
    favlink.addEventListener('click', (event) => {
      event.preventDefault();
      if (username && uuid) {
        let href = favlink.getAttribute('href');
        let suffix = `?username=${username}&sessionId=${uuid}`;

        /* don't add the suffix if it has already been added */
        if (!href.endsWith(suffix)) {
          favlink.setAttribute('href', href + suffix); // still bug-prone though
        }
        window.location = favlink.getAttribute('href');
      } else {
        alert('Please log in first.');
      }
    });
  });
};
