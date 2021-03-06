# EatSafe Web app

This is a frontend to access the Chicago health inspection data available
through the [EatSafe API](https://github.com/samzhang111/EatSafe). It's mostly
React on top of a tiny Flask app that passes AJAX requests on to the API.

Demo live at [http://eatsafeweb.herokuapp.com/](http://eatsafeweb.herokuapp.com/).

To use:

    git clone https://github.com/loganmhb/eatsafe-web
    cd eatsafe-web

In order to run the app you need a Google Maps API key. Store the key in an environment variable called GOOGLE_MAPS_KEY.

You need Flask to run the application. I use virtualenv. If you have that installed, then after downloading the project, set up the virtual environment folder (which I call venv):

    virtualenv venv

Then activate it:

    source venv/bin/activate

Then install Flask:

    pip install flask

To serve the application locally, run:

    python eatsafeweb.py

After the initial setup, the app can be run with:

    source venv/bin/activate
    python eatsafeweb.py

The React JSX files are kept in a separate jsx/ directory. To compile them to plain Javascript, you need the React command-line tools, available through the npm module react-tools.

The UI only supports the "near" API method currently, and does not yet
support optional arguments.
