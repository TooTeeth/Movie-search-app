const API_KEY = "9f80d1d";
import { API_URL } from "./config.js";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");
const favoritesContainer = document.getElementById("favorites-container");

let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // localStorage에서 즐겨찾기 불러오기

// 영화 검색 함수
async function searchMovies(query) {
  try {
    const response = await fetch(`${API_URL}&s=${query}`);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      moviesContainer.innerHTML = `<p>No result found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesContainer.innerHTML = `<p>Error fetching movies. Please try again.</p>`;
  }
}

// 영화 목록을 화면에 표시하는 함수
function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png"}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="favorite-btn">${favorites.includes(movie.imdbID) ? "Remove from Favorites" : "Add to Favorites"}</button>
      
    `;

    // 영화 카드 클릭 시 이벤트 처리
    movieCard.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-btn")) {
        toggleFavorite(movie.imdbID); // 즐겨찾기 추가/제거
        e.stopPropagation();
      } else {
        window.location.href = `details.html?id=${movie.imdbID}`;
      }
    });

    moviesContainer.appendChild(movieCard);
  });
}

// 즐겨찾기 추가/제거 함수
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }

  updateFavorites(); // 즐겨찾기 업데이트
}

// 즐겨찾기 목록 업데이트 함수
async function updateFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites)); // localStorage에 저장

  favoritesContainer.innerHTML = "";

  for (const id of favorites) {
    const movie = await fetchMovieById(id);
    const favoriteCard = document.createElement("div");
    favoriteCard.className = "movie-card";
    favoriteCard.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png"}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="remove-btn">Remove</button>
    `;

    // "Remove" 버튼 클릭 시 즐겨찾기에서 제거
    const removeBtn = favoriteCard.querySelector(".remove-btn");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFavorite(id); // 즐겨찾기에서 영화 제거
    });

    favoritesContainer.appendChild(favoriteCard);
  }
}

// 영화 정보를 ID로 가져오는 함수
async function fetchMovieById(id) {
  try {
    const response = await fetch(`${API_URL}&i=${id}`);
    const data = await response.json();
    return data; // 데이터 반환
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// 즐겨찾기에서 영화 제거 함수
function removeFavorite(id) {
  favorites = favorites.filter((favId) => favId !== id); // 즐겨찾기 목록에서 제거
  updateFavorites(); // 즐겨찾기 목록 업데이트
}

// 검색 버튼 클릭 시 이벤트 처리
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (query) {
    searchMovies(query);
  }
});

// 페이지 로드 시 즐겨찾기 목록을 불러와서 업데이트
updateFavorites();
