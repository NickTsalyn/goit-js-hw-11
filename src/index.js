import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const apiKey = '38524305-622add03b446e56a9366d3fee';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let currentSearchQuery = '';

const lightbox = new SimpleLightbox('.gallery a');
loadMoreBtn.addEventListener('click', loadMoreImages);

async function searchImages(query, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

function renderGallery(images) {
  const cardsMarkup = images.map(
    image => `
    <div class="photo-card">
      <a href="${image.largeImageURL}" data-lightbox="gallery">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `
  );
  gallery.insertAdjacentHTML('beforeend', cardsMarkup);
}

async function loadMoreImages() {
  page++;
  try {
    const data = await searchImages(currentSearchQuery, page);
    if (data.hits.length === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      renderGallery(data.hits);
      lightbox.refresh();
    }
  } catch (error) {
    Notiflix.Notify.failure('Error while fetching images. Please try again.');
  }
}

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.info('Please enter a search query.');
    return;
  }

  currentSearchQuery = searchQuery;
  page = 1;

  try {
    const data = await searchImages(currentSearchQuery, page);
    if (data.hits.length === 0) {
      gallery.innerHTML = '';
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.innerHTML = ''
      renderGallery(data.hits);
      lightbox.refresh();
      loadMoreBtn.style.display = 'block';
      event.target.elements.searchQuery.value = ''
    }
  } catch (error) {
    Notiflix.Notify.failure('Error while fetching images. Please try again.');
  }
});
