<?php

    # Name: Charlie Merth
    # Date: 5/14/18
    # Section: AJ
    # 
    # Handles API requests by giving the names and elevations of countries
    
    error_reporting(E_ALL);
    
    # A global associative array of the countries and elevations parsed from the CSV file
    $GLOBALS['countries'] = [];
    
    # Parses countries.csv for the country and elevation data, updates global array
    function initializeData() {
        $countries_csv = fopen("countries.csv", "r");
        header("Content-type: text/plain; charset=utf-8");
        # push each new line into the global country array
        while (($country = fgetcsv($countries_csv)) !== FALSE) {
            $country_name = strtolower($country[0]);
            $GLOBALS['countries'][$country_name] = $country;
        }
    }
    
    initializeData();

    # Check for valid GET request, then send data
    if (isset($_GET["country"])) {
        if($_GET["country"] === "all") {
            list_countries();
        } else {
            search_country($_GET["country"]);
        }
    } else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-Type: text/plain");
        print "Error: This parameter does not exist.";
    }

    # Checks to see if search parameter matches a country in the global array. If it does then print as JSON, 
    # else send a 400 error
    function search_country($searched_country) {
        if ($GLOBALS['countries'][$searched_country] !== NULL) {
            $response = [];
            $response["name"] = $GLOBALS['countries'][$searched_country][0];
            $response["location"] = $GLOBALS['countries'][$searched_country][1];
            $response["elevation"] = $GLOBALS['countries'][$searched_country][2];
            $response = json_encode($response);
            header("Content-type: application/json");
            print $response;
        } else {
            header("HTTP/1.1 400 Country Not Found");
            header("Content-type: text/plain");
            print "Country not found. Please try again";
        }
    }

?> 