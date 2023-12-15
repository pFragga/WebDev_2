var categoryAds = [];

/* we assume that the URL has id={category_id} as the last search parameter */
function getCategoryId() {
  let searchParams = new URLSearchParams(window.location.href);
  for (const [key, value] of searchParams.entries()) {
    if (key.endsWith('id')) {
      return value;
    }
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
  });
};
