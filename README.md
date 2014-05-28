uber-foodtruck-challenge
========================

This web application was built for Uber’s coding challenge. The app features an interactive map of San Francisco’s Food Trucks, using data from DataSF:Food Trucks


The App
========================
You can view this app live at http://54.187.124.79/, which is an EC2 instance.

Software & Track
========================

Track: Full Stack
-	Backbone.js: no experience, lightweight MVC JavaScript framework great for one-page web apps
-	Python: little experience, works well with JSON and MongoDB
-	MongoDB: very little experience, just used MongoDB for homework assignment in Big Data class-very simple to use, BSON similar to JSON, good performance overall
-	PHP: little experience, easy to use with JSON and MongoDB

Usage
========================
This application displays an interactive map of locations of food trucks in San Francisco, depending on the user’s location.  The application will recalculate which food trucks are around the user if the user moves location. Clicking on a marker will show the name of the truck as well as its food and the address. To see if a certain food truck exists, type in the truck name in the search bar, and any successful results will show up.

Assumptions
========================
This application assumes that users will be using a modern browser, preferably Google Chrome or Mozilla Firefox. This application also assumes that the user will remain in San Francisco.

Improvements
========================
As I only spent several hours on this challenge (suggested time was around 3-5 hours) and with no experience of Backbone.js, I did not have much time to test and learn more about automated tests.
-	I do not have any formal knowledge about testing, so I tested what I could in a manual way.
-	Not enough error handling/checking.
-	Javascript could possibly be split into different files for more clarification.
-	Have the search results show up in the form of markers.
-	Improve speed


About the Author
========================
Chantelle Cheng just completed her B.S.E in Computer Science and Mathematics at Vanderbilt University in May. Her resume can be found at http://bit.ly/1tlaA0t, and she has a website: http://chantellecheng.com