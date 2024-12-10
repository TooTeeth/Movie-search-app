const API_KEY = "9f80d1d";
import { API_URL } from "./config.js";

const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieOverview = document.getElementById("movie-overview");
const movieRating = document.getElementById("movie-rating");
const movieActors = document.getElementById("movie-actors");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function fetchMovieDetails(id) {
  try {
    const response = await fetch(`${API_URL}&i=${id}`);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovieDetails(data);
    } else {
      console.error("Error fetching movie details:", data.Error);
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }

  function displayMovieDetails(movie) {
    moviePoster.src = movie.Poster !== "N/A" ? movie.Poster : "assets/no-image.png";
    movieTitle.textContent = movie.Title;
    movieOverview.textContent = movie.Plot || "No overview available.";
    movieRating.textContent = movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "N/A";
    movieActors.textContent = movie.Actors || "No actors listed.";
  }
}

if (movieId) {
  fetchMovieDetails(movieId);
}
