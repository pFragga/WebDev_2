/**
 * Sends a POST request to the specified url and returns the user's favorite
 * ads.
 */
async function getUserFavorites(username, sessionId, url) {
  try {
    let response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          sessionId: sessionId
        })
      }
    );

    let data = await response.json();
    if (response.ok) {
      return data.favorites;
    }
  } catch (error) {
    console.error('Error in getting user favorites: ', error);
  }
}

window.onload = async () => {
  let username = getUrlParam('username');
  let sessionId = getUrlParam('sessionId');

  /* see: functions.js */
  let favorites = await getUserFavorites(username, sessionId, '/favorites');

  /* modify template */
  let favoritesTag = document.getElementById('favorite-ads');
  let templateText = document.getElementById('template').textContent;
  let templateFunc = Handlebars.compile(templateText);
  let htmlContent = templateFunc({
    favoriteAds: favorites
  });
  favoritesTag.innerHTML = htmlContent;
};
