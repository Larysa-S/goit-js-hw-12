import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let query = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(e) {
  e.preventDefault();

  query = e.currentTarget.elements['search-text'].value.trim();
  page = 1;

  if (query === '') {
    iziToast.warning({ message: 'Please enter a search term' });
    return;
  }

  clearGallery();
  hideLoadMoreButton(); // ЗАМІНЕНО: тепер через функцію
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({ message: 'Sorry, no images found.' });
    } else {
      createGallery(data.hits);
      checkBtnStatus(data.totalHits);
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
  } finally {
    hideLoader();
    e.target.reset();
  }
}

async function handleLoadMore() {
  page += 1;

  hideLoadMoreButton(); // ЗАМІНЕНО: тепер через функцію
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    smoothScroll();
    checkBtnStatus(data.totalHits);
  } catch (error) {
    iziToast.error({ message: 'Error loading more images' });
  } finally {
    hideLoader();
  }
}

function checkBtnStatus(totalHits) {
  const lastPage = Math.ceil(totalHits / perPage);

  if (page >= lastPage) {
    hideLoadMoreButton(); // ЗАМІНЕНО: тепер через функцію
    if (totalHits > 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } else {
    showLoadMoreButton(); // ЗАМІНЕНО: тепер через функцію
  }
}

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const cardHeight = galleryItem.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
