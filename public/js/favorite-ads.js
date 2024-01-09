document.addEventListener("DOMContentLoaded", async function () {
    // Extract username and sessionId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
    const sessionId = urlParams.get("sessionId");
  
    // Check if username and sessionId are available
    if (username && sessionId) {
      try {
        // Make a request to Favorites Retrieval Service (FRS)
        const favoriteAds = await fetchFavoriteAds(username, sessionId);
  
        // Render the favorite ads using Handlebars
        renderFavoriteAds(favoriteAds);
      } catch (error) {
        console.error("Error fetching favorite ads:", error);
      }
    } else {
      console.error("Username or sessionId missing from URL");
      // You might want to handle this case by redirecting or displaying an error message
    }
  });
  
 