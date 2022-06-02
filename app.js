const input = document.querySelector(".search-bar__input");
const searchIcon = document.querySelector("#search-bar__icon");
const albumsList = document.querySelector(".albums-list");
const albumTemplate = document.querySelector(".album-list-item-template");
const searchResultsDisplay = document.querySelector(
  ".search-bar__results-display"
);
const artist = document.querySelector(".search-bar__results-artistname");
const loading = document.querySelector(".search-bar__loading-animation");
const title = document.querySelector(".albums-list__h2");
const showMore = document.querySelector(".show-more");

// fetch API
function fetchAlbums(ARTIST_NAME) {
  loading.style.display = "block";
  let artistName = ARTIST_NAME;
  fetch(
    `https://itunes.apple.com/search?term=${ARTIST_NAME}&media=music&entity=album&attribute=artistTerm&limit=200`
  )
    .then((res) => res.json())
    .then((data) => {
      const results = [];
      data.results.forEach((item) => {
        results.push(item);
      });

      let index1 = 0;
      let index2 = 20;

      // If there is no result, showMore button will not display, otherwise it will display.
      if (results.length === 0) {
        showMore.style.display = "none";
      } else if (results.length <= 20) {
        // If the number of results is less than 20, then use help function show all these results
        showItems(0, results.length, results);
        showMore.style.display = "block";
      } else {
        // If the number of results is more than 20, then use help function show first 20 results
        showItems(index1, index2, results);
        showMore.style.display = "block";
      }

      // when you click the showMore button, it will display the next 50 results
      showMore.addEventListener("click", () => {
        index1 += 20;
        index2 += 50;
        // this flag is used to check whether the search range is over the the total number of the results
        let flag = 0;
        // if the search range of results is over the total number of the results, It will ignore the redundant part and display only the rest
        if (index2 > results.length) {
          flag = 1;
          showItems(index2 - 50, results.length, results);
          title.innerText = `${results.length}/${results.length} results for "${artistName}"`;
          showMore.disabled = true;
        }
        // defaut render part, however, if the search range of results exceeds the total number of the results (flag in not equal to 0), it will not be executed.
        if (flag === 0) {
          showItems(index1, index2, results);
          title.innerText = `${index2}/${results.length} results for "${artistName}"`;
        }
      });
      loading.style.display = "none";
      // if there is no result or the number of results which is less than 20, showMore button will be disabled
      if (results.length === 0) {
        title.innerText = `0 results for "${artistName}"`;
        showMore.disabled = true;
      } else if (results.length <= 20) {
        title.innerText = `${results.length}/${results.length} results for "${artistName}"`;
        showMore.disabled = true;
      } else {
        showMore.disabled = false;
        title.innerText = `${index2}/${results.length} results for "${artistName}"`;
      }
    });
}

// Helper
// render results from index1 to index2 (begining with 0 and 20)
function showItems(index1, index2, results) {
  for (let i = index1; i < index2; i++) {
    renderAlbum(results[i]);
  }
}

// remove the previous title (XX/XX results for "XXX")
function clearResults() {
  title.innerText = "";
}

// when you click the search icon, it will display the results which match to your input
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

// when you press "enter" using keyboard, it will display the results which match to your input
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
