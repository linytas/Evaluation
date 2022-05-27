const input = document.querySelector(".search-bar__input");
const searchIcon = document.querySelector("#search-bar__icon");
const albumsList = document.querySelector(".albums-list");
const albumTemplate = document.querySelector(".album-list-item-template");
const searchResultsDisplay = document.querySelector(
  ".search-bar__results-display"
);
const count = document.querySelector(".search-bar__results-count");
const artist = document.querySelector(".search-bar__results-artistname");
const loading = document.querySelector(".search-bar__loading-animation");

// fetch API
function fetchAlbums(ARTIST_NAME) {
  loading.style.display = "block";

  fetch(
    `https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200`
  )
    .then((res) => res.json())
    .then((data) => {
      const results = [];
      data.results.forEach((item) => {
        results.push(item);
      });

      showItems(0, results.length, results);

      loading.style.display = "none";
      searchResultsDisplay.style.display = "block";
      count.innerText = `${data.resultCount}`;
    });
}

// Helper
function showItems(index1, index2, results) {
  for (let i = index1; i < index2; i++) {
    renderAlbum(results[i]);
  }
}

function clearResults() {
  searchResultsDisplay.style.display = "none";
  count.innerText = "";
}

searchIcon.addEventListener("click", () => {
  if (input.value === "") {
    alert(`Please fill out this field`);
  } else {
    clearResults();
    albumsList.innerHTML = "";
    fetchAlbums(input.value);
  }
  input.value = "";
});

input.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (input.value === "") {
      alert(`Please enter artist's name`);
    } else {
      clearResults();
      albumsList.innerHTML = "";
      fetchAlbums(input.value);
    }
    input.value = "";
  }
});

// Render
function renderAlbum(item) {
  const templateClone = albumTemplate.content.cloneNode(true);
  const albumImg = templateClone.querySelector(".album-list-item-img");
  albumImg.src = item.artworkUrl100;
  const albumName = templateClone.querySelector(".album-list-item-name");
  albumName.innerText = item.collectionName;
  albumsList.appendChild(templateClone);
}
