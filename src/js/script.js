import { BASE_URL, options } from './pixabay-api.js';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio.js';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.querySelector('#search-form');

let reachEnd = false;
let totalHits = 0;

const lightbox = new simpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

function renderGallery(hits) {
  let markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <a href="${largeImageURL}" class="lightbox">
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy"  width="320px" height="260px"/>
                <div class="info">
                    <p class="info-item">
                    <b>Likes</b>
                     ${likes}
                    </p>
                    <p class="info-item">
                    <b>Views</b>
                    ${views}
                    </p>
                    <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                    </p>
                    <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                    </p>
                </div>
            </div>
        </a>
      `;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  if (options.params.page * options.params.per_page >= totalHits) {
    if (!reachEnd) {
      Notify.info('Reached end of search results.');
      reachEnd = true;
    }
  }
  lightbox.refresh();
}

async function handleSubmit(e) {
  e.preventDefault();
  options.params.q = searchInputEl.value.trim();

  if (options.params.q === '') return;
  options.params.page = 1;
  galleryEl.innerHTML = '';
  reachEnd = false;

  try {
    const res = await axios.get(BASE_URL, options);
    totalHits = res.data.totalHits;

    const { hits } = res.data;

    if (totalHits === 0) {
      Notify.failure('No images match your search query.');
    } else {
      Notify.success(`${totalHits} images match your search query.`);
      renderGallery(hits);
    }
    searchInputEl.value = '';
  } catch (e) {
    Notify.failure(e);
  }
}

async function loadMore() {
  options.params.page += 1;
  try {
    const res = await axios.get(BASE_URL, options);
    const hits = res.data.hits;
    renderGallery(hits);
  } catch (e) {
    Notify.failure(e);
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMore();
  }
}

searchFormEl.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);
