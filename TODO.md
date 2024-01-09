# Assignment 2

TODOs for each part of the assignment.

## Part 1

- [x] Figure out how to send GET requests
- [x] Join categories and subcategories list into one single object. Then pass
  it to `templateFunc`.
- [x] Figure out why `GET /categories/:id/subcategories` returns empty arrays
- [x] `GET /ads?category=2` and `GET /ads?category=4` always return empty
- [x] Add classes and extra attributes to html tags inside templates
- [x] Refactor `getCategoryId()` to something more general/abstract
- [ ] Fix favicon.ico 404 error
- [x] In subcategories, add a features table to each ad

## Part 2

- [x] Create a login form in categories.html
- [x] Add some css styling
- [x] Install npm dependencies, restructure project
- [x] Implement the login service using express
    - [x] Appropriate status for server response. Inform user with `alert()`
    - [x] Use javascript to submit form data, instead of the standard html way
    - [x] Returns uuid inside of a json object
    - [x] For user validation, create ~~samples inside 'models' directory~~
      classes and DAOs
- [x] Implement the add to favourites service
    - [x] add button to each section in categories
    - [x] frontend - backend communication
      - [x] server side stuff (validateUser(),isAdInFavorites(),addToFavorites())
      - [x] client side intergration (addToFavorites(), getAdDataById())
- [ ] Fix bug where user can be logged in as more that one person

## Part 3

~~NO MORE JS PLEASE I BEG YOU~~

- [ ] category.html links to favorite-ads.html
- [ ] `username` and `sessionId` from category.html encoded as URL parameters
- [ ] Favorites Retrieval Service - FRS
    - [ ] Access the user's favorites via GET request to '/favorites'
    - [ ] '/favorites' in index.js resonds with the user's favorites list
      (json), upon validating `username` and `sessionId`

