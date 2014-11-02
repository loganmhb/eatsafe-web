# EatSafe Web app

This is a frontend to access the Chicago health inspection data available
through the [EatSafe API](https://github.com/samzhang111/EatSafe). It's mostly
React on top of a tiny Flask app that passes AJAX requests on to the API.

To use:

    git clone https://github.com/loganmhb/eatsafe-web
    cd eatsafe-web
    python eatsafe.py

The only thing you can do right now is enter latitude, longitude coordinates. Try (41.9, -87.6) to see some results. Be warned: it's ugly.
