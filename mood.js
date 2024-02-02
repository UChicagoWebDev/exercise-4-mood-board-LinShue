const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  document.getElementById("resultsImageContainer").innerHTML = "";


  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const query = document.querySelector(".search input").value;
  const queryUrl = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;


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
  request.open('GET', queryUrl);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.onload = function() {
    if(request.status === 200) {
      console.log(request.response)
      displayImageResults(request.response);
      displayRelatedConcepts(request.response);
    }else {
      console.error("Search Failed: ", request.statusText);
    }
  }
  
  //request.addEventListener('load', function(event) {
  //  if (request.status >= 200 && request.status < 300) {
  //    const response = event.target.response;
  //    displayImageResults(response.value); 
  //    displayRelatedConcepts(response.queryExpansions); 
  //  } else {
  //    console.warn(request.statusText, request.responseText);
  //  }
  //});

  request.send();


  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

//function displayRelatedConcepts(concepts) {
//  const resultsContainer = document.querySelector("#results");
  
  // Clear any existing related search concepts
//  resultsContainer.innerHTML = "";

//  concepts.forEach((concept) => {
//    const button = document.createElement('button');
//    button.textContent = concept.displayText;
//    button.onclick = function() {
//      document.querySelector("#searchbar").value = concept.displayText;
//      runSearch(); // Re-run search with the new concept
//    };
//    resultsContainer.appendChild(button);
//  });
//}

function displayRelatedConcepts(response) {
  const suggestions = document.querySelector(".suggestions ul");
  suggestions.innerHTML = "";

  const maxRelatedSuggestions = 10;
  const searchSuggestions = response.relatedSearches?.slice(0, maxRelatedSuggestions) || [];

  searchSuggestions.forEach(item => {
    const listItem = document.createElement("li");
    listItem.textContent = item.text;
    listItem.onclick = () => {
      document.querySelector(".search input").value = item.text;
      runSearch();
    };
    suggestions.appendChild(listItem);
  });
}

//function displayImageResults(images) {
//  const resultsImageContainer = document.querySelector("#results");
//
  /// Clear previous images if any
  //resultsImageContainer.innerHTML = "";

//  images.forEach((image) => {
//    const img = document.createElement('img');
//    img.src = image.thumbnailUrl;
//    img.alt = image.name;
//    img.onclick = function() {
 //     addToMoodBoard(image.contentUrl); // Function to add image to mood board
  //  };
    //resultsImageContainer.appendChild(img);
  //});
//}
function displayImageResults(response) {
  const resultsContainer = document.getElementById("resultsImageContainer");
  response.value.forEach(item => {
    const imageElement = document.createElement("img");
    imageElement.src = item.thumbnailUrl;
    imageElement.onclick = () => addToMoodBoard(imageElement);
    resultsContainer.appendChild(imageElement);
  });
}

function addToMoodBoard(img) {
  const board = document.getElementById("board");
  const imageElement = img.cloneNode();
  board.appendChild(imageElement);
}

function runInitialSuggestionsSearch(query) {
  document.querySelector(".search input").value = query;
  runSearch();
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

