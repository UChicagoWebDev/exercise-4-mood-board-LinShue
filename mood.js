const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  document.querySelector("#results").innerHTML = "";

  const searchTerm = document.querySelector(".search input").value;
  if (!searchTerm) return false;

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const queryUrl = `${bing_api_endpoint}?q=${encodeURIComponent(searchTerm)}`;


  let request = new XMLHttpRequest();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // TODO: Send the request
  request.open('GET', queryUrl, true);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.addEventListener('load', function(event) {
    if (request.status >= 200 && request.status < 300) {
      const response = event.target.response;
      displayImageResults(response.value); // Function to display images
      displayRelatedConcepts(response.queryExpansions); // Function to display related concepts
    } else {
      console.warn(request.statusText, request.responseText);
    }
  });

  request.send();


  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function displayRelatedConcepts(concepts) {
  const resultsContainer = document.querySelector("#results");
  
  // Clear any existing related search concepts
  resultsContainer.innerHTML = "";

  concepts.forEach((concept) => {
    const button = document.createElement('button');
    button.textContent = concept.displayText;
    button.onclick = function() {
      document.querySelector("#searchbar").value = concept.displayText;
      runSearch(); // Re-run search with the new concept
    };
    resultsContainer.appendChild(button);
  });
}

function displayImageResults(images) {
  const resultsImageContainer = document.querySelector("#results");

  // Clear previous images if any
  resultsImageContainer.innerHTML = "";

  images.forEach((image) => {
    const img = document.createElement('img');
    img.src = image.thumbnailUrl;
    img.alt = image.name;
    img.onclick = function() {
      addToMoodBoard(image.contentUrl); // Function to add image to mood board
    };
    resultsImageContainer.appendChild(img);
  });
}

function addToMoodBoard(imageUrl) {
  const moodBoardContainer = document.querySelector("#board");
  const img = document.createElement('img');
  img.src = imageUrl;
  moodBoardContainer.appendChild(img);
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector("#runSearchButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission
    runSearch();
  });

  document.querySelector(".search input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission
      runSearch();
    }
  });

  document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);

  document.querySelector("body").addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeResultsPane();
    }
  });
});
