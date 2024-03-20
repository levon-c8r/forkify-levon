import * as modal from './modal.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView';
import resultsView from './view/resultsView';
import bookmarksView from './view/bookmarksView';
import paginationView from './view/paginationView';
import addRecipeView from './view/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config';

const controlRecipe = async function () {
  try {
    //get recipe id
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return;

    resultsView.update(modal.getSearchResultsPage());
    bookmarksView.update(modal.state.bookmarks);

    //render spinner
    recipeView.renderSpinner();

    //load recipe
    await modal.loadRecipe(id);

    //render recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await modal.loadSearchResults(query);

    resultsView.render(modal.getSearchResultsPage());
    paginationView.render(modal.state.search);
  } catch (e) {
    console.log(e);
  }
};

const controlPagination = function (gotToPage) {
  resultsView.render(modal.getSearchResultsPage(gotToPage));
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings
  modal.updateServings(newServings);

  // update the recipe view
  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);
  recipeView.update(modal.state.recipe);
  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await modal.uploadRecipe(newRecipe);
    // console.log(modal.state.recipe);

    recipeView.render(modal.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(modal.state.bookmarks);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (e) {
    console.error(e);
    addRecipeView.renderError(e.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerCLick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
