var adCategories = [];
var adSubcategoriesById = [];
var subcategoriesById = [
  [
    { id: 1, category_id: 1, title: 'alsdjkfl;asdfh' },
    { id: 2, category_id: 1, title: 'z,mcbx,mbzcv' },
  ],
  [
    { id: 1, category_id: 2, title: 'yqwoeriw' },
    { id: 2, category_id: 2, title: 'The quick brown fox jumped over the lazy dogs.' },
  ],
  [
    { id: 1, category_id: 3, title: 'Marcus Aurelius' },
    { id: 2, category_id: 3, title: 'Biggus Dickus' },
  ],
];

async function fetchStuff() {
  let res = await fetch('https://wiki-ads.onrender.com/categories');
  let data = await res.json();
  adCategories = data;

  if (adCategories != null) {
    for (let category in adCategories) {
      let res = await fetch(`https://wiki-ads.onrender.com/categories/:${category.id}/subcategories`);
      let data = await res.json();
      adSubcategoriesById.push(data);
    }
  }
}

window.onload = () => {
  fetchStuff()
    .then(() => {
      /* add subcategories to categories list */
      adCategories.forEach((category) => {
        subcategoriesById.forEach((entry) => {
          if (entry[0].category_id == category.id) {
            category['subcategories'] = entry;
          }
        });
      });

      /* modify template */
      let categoriesTag = document.getElementById('ad-categories');
      let templateText = document.getElementById('template').textContent;
      let templateFunc = Handlebars.compile(templateText);
      let htmlContent = templateFunc({
        data: adCategories
      });

      categoriesTag.innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error(error);
    });
};
