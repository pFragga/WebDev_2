/* sample object returned from 'GET /categories' */
let categoriesJson = `
{
  "categories": [
    {
      "id": 1,
      "title": "Vehicles",
      "img_url": "resources/αυτοκίνητα.jpg"
    },
    {
      "id": 2,
      "title": "Houses",
      "img_url": "resources/ακίνητα.jpg"
    }
  ]
}
`;

/* sample object returned from 'GET /subcategories' */
let subcategoriesJson = `
{
  "subcategories": [
    {
      "id": 1,
      "category_id": 1,
      "title": "Cars"
    },
    {
      "id": 2,
      "category_id": 1,
      "title": "Motorbikes"
    }
  ]
}
`;

window.addEventListener('load', function() {
  let categoriesTag = document.getElementById('categories');

  let categoriesTemplate = `
  {{#each categories}}
  <section class="category">
  <h2>{{title}}</h2>
  <a href="category.html?id={{id}}">
    <img src="{{img_url}}" alt="Image that links to category page.">
  </a>
  <ul class="subcategories">
  </ul>
  </section>
  {{/each}}
  `;

  let templateFunc = Handlebars.compile(categoriesTemplate);
  let htmlContent = templateFunc({
    categories: JSON.parse(categoriesJson).categories,
    subcategories: JSON.parse(subcategoriesJson).subcategories,
  });

  categoriesTag.innerHTML = htmlContent;
});
