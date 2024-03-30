export const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '43115668-a2f7633784c8066bb06af8b7b';

export const options = {
  params: {
    key: API_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};
