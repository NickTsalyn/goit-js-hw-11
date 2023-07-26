import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import axios from 'axios';
import SlimSelect from 'slim-select';



axios.defaults.headers.common['x-api-key'] =
  'live_vpT8AlM2UzkT2NU9PvSi7LYErckhMQOSy2G7GM3Q13VkTLIhMAj8zKURMQiz92zB';



const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

export function fetchBreeds() {
    return axios
      .get('https://api.thecatapi.com/v1/breeds')
      .then(response => response.data)
      .catch(error => {
        throw new Error(
            Notiflix.Notify.failure(`${error.textContent}`))
      });
  }
  
  export function fetchCatByBreed(breedId) {
    return axios
      .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
      .then(response => response.data[0])
      .catch(error => {
        throw new Error(
            Notiflix.Notify.failure("`${error.textContent}`")
        );
      });
  }

breedSelect.addEventListener('change', handleBreedSelectChange);

function handleFetchError() {
  loader.style.display = 'none';
  error.style.display = 'block';
  breedSelect.style.display = 'none'
}

function handleFetchSuccess(breeds) {
  loader.style.display = 'none';
  const option = breeds
  .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
  .join('');
  breedSelect.insertAdjacentHTML('beforeend', option)
}

function handleBreedSelectChange() {
  const selectedBreedId = breedSelect.value;
  loader.style.display = 'block';
  catInfo.style.display = 'none';
  error.style.display = 'none';

  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      loader.style.display = 'none';
      catInfo.innerHTML = `
        <img src="${cat.url}" alt="${cat.breeds[0].name}" width="300" height="300">
        <h2>${cat.breeds[0].name}</h2>
        <p>Description: ${cat.breeds[0].description}</p>
        <p>Temperament: ${cat.breeds[0].temperament}</p>
      `;
      catInfo.style.display = 'block';
      console.log(cat);
    })
    .catch(handleFetchError);
}

window.addEventListener('DOMContentLoaded', () => {
  loader.style.display = 'block';
  error.style.display = 'none';
  fetchBreeds().then(handleFetchSuccess).catch(handleFetchError);
});




// const BASE_URL = 'https://restcountries.com/v3.1/name/';
// const DEBOUNCE_DELAY = 300;
// const list = document.querySelector('.country-list');
// const country = document.querySelector('.country-info');

// function fetchCountries(name) {
//   return fetch(
//     `${BASE_URL}${name}?fields=name,capital,population,flags,languages`
//   ).then(responce => {
//     if (!responce.ok) {
//       throw new Error(
//         Notiflix.Notify.failure('Oops, there is no country with that name')
//       );
//     }
//     const result = responce.json();
//     return result;
//   });
// }

// const input = document.querySelector('#search-box');

// input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// function onInput(evt) {
//   const search = evt.target.value.trim();
//   if (!search) {
//     list.innerHTML = '';
//     country.innerHTML = '';
//     return;
//   }
//   fetchCountries(search).then(filterCountries);
// }

// function filterCountries(countries) {
//   if (countries.length > 10) {
//     return Notiflix.Notify.info(
//       'Too many matches found. Please enter a more specific name.'
//     );
//   } else if (countries.length > 1 && countries.length <= 10) {
//     clear()
//     createList(countries);
//   } else if (countries.length === 1) {
//     clear()
//     createInfo(countries);
//   }
//   console.log(countries);
// }

// function createList(countries) {
//   const listItem = countries
//     .map(
//       ({ name, flags }) =>
//         `<li>
//         <img src="${flags.svg}" width="50" height="30" alt="${flags.alt}">
//         <p>${name.common}</p>
//     </li>`
//     )
//     .join('');

//   list.insertAdjacentHTML('beforeend', listItem);
//   console.log(listItem);
// }

// function createInfo(countries) {
//   const [
//     {
//       name: { common },
//       flags: { svg, alt },
//       capital,
//       population,
//       languages,
//     },
//   ] = countries;
//   const info = `<div>
//     <img src="${svg}" alt="${alt}" width="50px" height="30px">
//     <p>${common}</p>
//   </div>
//   <p>Capital: <span>${capital}</span></p>
//   <p>Population: <span>${population}</span></p>
//   <p>Languages: <span>${Object.values(languages).join(', ')}</span></p>`;

//   country.innerHTML = info;
// }

// function clear() {
//   country.innerHTML = '';
//   list.innerHTML = '';
// }





// "Гра на вгадування слів або чисел":

// Користувач отримує випадкове слово або число, яке потрібно вгадати.
// Є обмежена кількість спроб (наприклад, 5 спроб) для вгадування правильного слова чи числа.
// Користувач може вводити свої варіанти відповіді через текстове поле або вікно введення.
// Після кожної спроби повідомляється користувачу, чи була відповідь правильною, чи ні.
// Якщо користувач вгадав слово чи число, гра завершується і повідомляється про перемогу. В іншому випадку, користувач може продовжити вгадування до вичерпання кількості спроб.

// Користувач має вгадати загадане випадкове число від 1 до 100. Він має 5 спроб на вгадування. При кожній спробі гра повідомляє користувачу, чи було введене число більше чи менше загаданого, і скільки спроб залишилось. Коли користувач вгадує число або вичерпує ліміт спроб, гра закінчується.

const input = document.querySelector("#guessInput");
const button = document.querySelector("#btn");
const text = document.querySelector("#message");
const clearButton = document.querySelector("#clear-btn");
const timer = document.querySelector("#timer");

const requiredInput = getRandomNumber();
let tryAmount = 4;
let startGame = false;
let time;
let timeInterval;

input.addEventListener("input", onInput);
button.addEventListener("click", onClick);
clearButton.addEventListener("click", clear);

function onInput(evt) {
  inputValue = evt.target.value.trim();
  console.log(inputValue);
  if (!startGame) {
    startGame = true;
    startCountdown();
  }
}

function onClick() {
  const guessWord = inputValue.toLowerCase();
  const guessNumber = parseInt(inputValue);
  if ((guessNumber || guessWord) === requiredInput.toString()) {
    text.textContent = "Вітаю ви вгадали";
    button.disabled = true;
    clearButton.disabled = false;
    clearInterval(timeInterval);
    timer.textContent = "";
  } else {
    text.textContent = `Мимо, залишилось ${tryAmount--} спроби`;
    clearButton.disabled = true;
    if (tryAmount < 0) {
      text.textContent = "Ви програли";
      button.disabled = true;
      clearButton.disabled = false;
      clearInterval(timeInterval);
      timer.textContent = "";
    }
  }
}

function clear() {
  tryAmount = 4;
  text.textContent = "";
  inputValue = "";
  input.value = "";
  button.disabled = false;
  clearButton.disabled = true;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function countdown() {
  let minutes = 2;
  let seconds = minutes * 60;
  timeInterval = setInterval(function () {
    seconds--;
    if (seconds >= 0) {
      const minutesRemain = Math.floor(seconds / 60);
      const secondsRemain = seconds % 60;

      timer.textContent = `${minutesRemain}:${secondsRemain
        .toString()
        .padStart(2, "0")}`;
    } else {
      clearInterval(timeInterval);
      timer.textContent = "";
    }
  }, 1000);
}

function startCountdown() {
  countdown();
}

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    if (clearButton.disabled) {
      return;
    } else {
      clear();
    }
  } else if (evt.key === "Enter") {
    onClick();
  }
});
