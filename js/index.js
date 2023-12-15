var adCategories = [];
var adSubcategoriesById = [];

window.onload = async () => {

  /* see: functions.js */
  await fetchData('https://wiki-ads.onrender.com/categories', (data) => {
    adCategories = data;
  })

  .then(async () => {
    /* each category requires a separate HTTP request */
    for (let category of adCategories) {
      let id = category.id;
      await fetchData(`https://wiki-ads.onrender.com/categories/${id}/subcategories`, (data) => {
        adSubcategoriesById.push(data);
      });
    }
  })

  .catch((error) => {
    console.error(error);
  })

  .finally(() => {
    /* add a subcategories field to each category */
    for (let i = 0; i < adCategories.length; i++) {
      for (let j = 0; j < adSubcategoriesById.length; j++) {
        adCategories[i].subcategories = adSubcategoriesById[i];
      }
    }
    /* modify template */
    let categoriesTag = document.getElementById('ad-categories');
    let templateText = document.getElementById('template').textContent;
    let templateFunc = Handlebars.compile(templateText);
    let htmlContent = templateFunc({
      categories: adCategories
    });
    categoriesTag.innerHTML = htmlContent;
  });
}
