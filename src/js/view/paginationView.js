import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerCLick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    const curPage = this._data.page;

    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage, { prev: false, next: true });
    }

    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage, { prev: true, next: false });
    }

    if (curPage < numPages) {
      return this._generateMarkupButton(curPage, { prev: true, next: true });
    }

    return '';
  }

  _generateMarkupButton(page, prevNext) {
    const prevButton = prevNext.prev
      ? `
      <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
         <svg class="search__icon">
           <use href="${icons}#icon-arrow-left"></use>
         </svg>
         <span>Page ${page - 1}</span>
       </button>
    `
      : '';

    const nextButton = prevNext.next
      ? `
      <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
         <span>Page ${page + 1}</span>
         <svg class="search__icon">
           <use href="${icons}#icon-arrow-right"></use>
         </svg>
      </button>
    `
      : '';

    return prevButton + nextButton;
  }
}

export default new PaginationView();
