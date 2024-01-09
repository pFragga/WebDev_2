var subcategoryAds = [];

window.onload = async () => {
  let id = getUrlParam('id');

  /* see: functions.js */
  await fetchData(`https://wiki-ads.onrender.com/ads?subcategory=${id}`, (data) => {
    subcategoryAds = data;
  })

  .catch((err) => {
    console.error(err);
  })

  .finally(() => {
    /* extract features from each ad and make a new attribute out of them */
    for (let ad of subcategoryAds) {
      ad['featuresArr'] = [];
      let features = ad.features.split('; ');
      for (let feature of features) {
        let namevaluePair = feature.split(': ');
        ad['featuresArr'].push(namevaluePair);
      }
    }

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
