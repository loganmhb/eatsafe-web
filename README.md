# EatSafe Web app

This is a frontend to access the Chicago health inspection data available
through the [EatSafe API](https://github.com/samzhang111/EatSafe). It's mostly
React on top of a tiny Flask app that passes AJAX requests on to the API.

To use:

    git clone https://github.com/loganmhb/eatsafe-web
    cd eatsafe-web

In order to run the app you need a Google Maps API key. Create a file
called "config.py," which should look like this:

    MAPS_KEY = <your Maps key here>

That's the only config option at this time.

You need Flask to run the application. I use venv, which entails:

    source venv/bin/activate

To serve the application locally, run:

    python eatsafe.py

The UI only supports the "near" API method currently, and does not yet
support optional arguments.
