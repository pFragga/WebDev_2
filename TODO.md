# Assignment 2

TODOs for each part of the assignment.

## Part 1

- [x] Figure out how to send GET requests
- [x] Join categories and subcategories list into one single object. Then pass
  it to `templateFunc`.
- [x] Figure out why `GET /categories/:id/subcategories` returns empty arrays
- [x] `GET /ads?category=2` and `GET /ads?category=4` always return empty
- [x] Add classes and extra attributes to html tags inside templates
- [ ] Refactor `getCategoryId()` to something more general/abstract
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
- [ ] Implement the add to favourites service
    - [x] add button to each section in categories
    - [ ] frontend - backend communication

