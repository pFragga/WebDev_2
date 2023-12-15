var subcategoryAds = [];

window.onload = async () => {
  let id = getCategoryId();

  /* see: functions.js */
  await fetchData(`https://wiki-ads.onrender.com/ads?category=${id}`, (data) => {
    subcategoryAds = data;
  })

  .catch((err) => {
    console.error(err);
  })

  .finally(() => {
    /* modify template */
    let adsTag = document.getElementById('subcategory-ads');
    let templateText = document.getElementById('template').textContent;
    let templateFunc = Handlebars.compile(templateText);
    let htmlContent = templateFunc({
      ads: subcategoryAds
    });
    adsTag.innerHTML = htmlContent;
  });
};
