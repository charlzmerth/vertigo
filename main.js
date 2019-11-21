/*
Charlie Merth
CSE 154 Section AJ
5/14/18

Javascript for Vertigo that implements search features and updates the page with results
*/

/* global fetch */

"use strict";
(function() {
  
  // name of local php file to fetch from
  const PHP_FILE = "vertigo.php"; 

  window.onload = function() {
    $("search-enter").onclick = searchCountry;
    $("country-search").focus();
    $("country-search").addEventListener("keypress", function(e) {
      if (e.which === 13) {
        searchCountry();
      }
    });
  };
  
  /**
  * Fetches the country entered in the search bar and delegates to the proper function to handle
  */
  function searchCountry() {
    let searchValue = $("country-search").value;
    $("search-error").classList.add("hidden");
    if (typeof searchValue === "string") {
      searchValue = searchValue.toLowerCase();
      let query = PHP_FILE + "?country=" + searchValue;
      fetch(query)
        .then(checkStatus)
        .then(JSON.parse)
        .then(updatePage)
        .catch(handleSearchError);
    }
  }
  
  /**
  * Updates the UI with country data
  * @param countryData the JSON received from vertigo.php
  */
  function updatePage(countryData) {
    $("search-error").classList.add("hidden");
    $("search-results").classList.remove("hidden");
    $("results-text").innerText = "The highest point in " + countryData.name + " is ";
    $("elevation").innerText = countryData.elevation;
    $("maps-link").innerText = "(" + countryData.location + ")";
    $("maps-link").href = "https://www.google.com/maps?basemap=satellite&zoom=11&q=" + countryData.location + "+" + countryData.name +"&t";
    $("maps-link").target = "_blank";
  }
  
  /**
  * Function to check the status of an Ajax call
  * @param response the response text from fetching the URL
  * @return did we succeed or not, so we know whether or not to continue with the handling of
  * this promise
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
  
  /**
  * Function to handle a fetch error
  */
  function handleSearchError() {
    $("search-results").classList.add("hidden");
    $("search-error").classList.remove("hidden");
  }


  /**
  *  Shortcut to get the document element by id
  *  @param the string value of the ID of the DOM element you are getting
  *  @return the DOM element with that particular ID
  */
  function $(id) {
    return document.getElementById(id);
  }

  /**
  *  Shortcut to document.querySelectorAll(query)
  *  @param the string value of the CSS selector of the DOM element you are getting
  *  @return the DOM elements that match
  */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
  * Function to check the status of an Ajax call, boiler plate code to include,
  * based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  * @param the response text from fetching the URL
  * @return did we succeed or not, so we know whether or not to continue with the handling of
  * this promise
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
  
})();
