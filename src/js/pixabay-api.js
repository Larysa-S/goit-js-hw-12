import axios from 'axios';

// Твій персональний ключ Pixabay
const API_KEY = '55210973-f163c09f944895a3800208151';
const BASE_URL = 'https://pixabay.com/api/';

//axios.defaults.baseURL = BASE_URL;

/**
 * Функція для виконання HTTP-запитів до Pixabay API
 * @param {string} query - пошукове слово
 * @param {number} page - номер сторінки
 * @returns {Promise<object>} - об'єкт data з відповіддю від сервера
 */

export async function getImagesByQuery(query, page = 1) {
  const searchParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };

  // Використовуємо властивість params для автоматичної генерації query-рядка
  const response = await axios.get(BASE_URL, { params: searchParams });

  // Повертаємо лише дані (data), як вимагає ТЗ
  return response.data;
}
