var adCategories = [];
var adSubcategoriesById = [];

async function fetchData(url, callback) {
  let myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');

  let response = await fetch(
    url,
    {
      method: 'GET',
      headers: myHeaders
    }
  );
  let data = await response.json();
  callback(data);
}

window.onload = async () => {
  await fetchData('https://wiki-ads.onrender.com/categories', (data) => {
    adCategories = data;
  })
  .then(async () => {
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
      data: adCategories
    });

    categoriesTag.innerHTML = htmlContent;
  });
}
