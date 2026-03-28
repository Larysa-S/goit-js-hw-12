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
const loadMoreBtn = document.querySelector('.load-more-btn'); // Кнопка "Load More"

let query = '';
let page = 1;
const perPage = 15; // Має збігатися з тим, що в pixabay-api.js

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

// 1. Обробка сабміту форми
async function handleSubmit(e) {
  e.preventDefault();

  query = e.currentTarget.elements['search-text'].value.trim();
  page = 1; // Скидаємо сторінку до першої

  if (query === '') {
    iziToast.warning({ message: 'Please enter a search term' });
    return;
  }

  clearGallery();
  loadMoreBtn.classList.add('is-hidden'); // Ховаємо кнопку перед новим пошуком
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.error({ message: 'Sorry, no images found.' });
    } else {
      createGallery(data.hits);
      checkBtnStatus(data.totalHits); // Перевіряємо, чи показувати кнопку
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
  } finally {
    hideLoader();
    e.target.reset();
  }
}

// 2. Обробка натискання "Load More"
async function handleLoadMore() {
  page += 1;
  showLoader();
  loadMoreBtn.classList.add('is-hidden'); // Тимчасово ховаємо кнопку

  smoothScroll();

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

// 3. Функція перевірки: чи показувати кнопку "Load More"
function checkBtnStatus(totalHits) {
  const lastPage = Math.ceil(totalHits / perPage);

  if (page >= lastPage) {
    loadMoreBtn.classList.add('is-hidden');
    if (totalHits > 0) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } else {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

// 4. Функція плавного скролу (опціонально, але корисно)
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
