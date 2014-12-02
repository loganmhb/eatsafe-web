/* EatSafe Web -- Frontend access to Chicago health inspection data 
   employing the EatSafe API at api.eatsafechicago.com,
   with Google Maps integration.  */

var markers;

var Restaurant = React.createClass({displayName: 'Restaurant',
  render: function() {
    // Get the picture from Yelp if available; otherwise use a placeholder.
    var picUrl = this.props.data.pic !== "" ?
      this.props.data.pic : "static/img/nopic.png";
    return (
      React.createElement("div", {className: "restaurant"}, 
        React.createElement("img", {className: "yelpPic", src: picUrl}), 
        React.createElement("h3", null, this.props.data.name), 
        React.createElement("p", null, "Recieved a rating of ", this.props.data.rating, ".")
      )
    );
  }
});

var RestaurantList = React.createClass({displayName: 'RestaurantList',
  render: function() {
    /* Output a list of Restaurant components, passing each object
       to the corresponding restaurant as a prop. */
    var restaurantNodes =
    this.props.restaurants.map(function(restaurant) {
      return (
	React.createElement(Restaurant, {data: restaurant, key: restaurant.id})
      );
    });
    return (
      React.createElement("div", {className: "restaurantList"}, 
        restaurantNodes
      )
    );
  }
});

// SearchBox takes a callback from EatSafe in order to query the API
// on form submit.

var SearchBox = React.createClass({displayName: 'SearchBox',
  handleSubmit: function(e) {
    // Don't post the form.
    e.preventDefault();
    // Query the API through callback.
    this.props.onSubmit(
      'instant',
      {query: this.refs.query.getDOMNode().value}
    );
    return;
  },
  render: function() {
    return (
      React.createElement("form", {id: "searchBox", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", ref: "query"}), 
        React.createElement("input", {type: "submit"})
      )
    );
  }
});


// Container to hold RestaurantList and SearchBox for display purposes

var RestaurantSearch = React.createClass({displayName: 'RestaurantSearch',
  render: function() {
    return (
      React.createElement("div", {className: "restaurantSearch"}, 
        React.createElement(SearchBox, {onSubmit: this.props.onSubmit}), 
        React.createElement(RestaurantList, {restaurants: this.props.restaurants})
      )
    );
  }
});

// Google Maps interface component

var MapCanvas = React.createClass({displayName: 'MapCanvas',
  getInitialState: function() {
    return {
      map: {},  // Don't request the map before mounting
    };
  },
  componentDidMount: function() {
    var mapOptions = {
      center: new google.maps.LatLng(41.903196, -87.625916), // EatSafe defaults
      zoom: 10
    };
    this.setState({
      map: new google.maps.Map(this.getDOMNode(),
                                  mapOptions)
    });
    // Create the map and attach it to the div AFTER component is
    // rendered initially.
  },
  addRestaurantMarkers: function() {
    var createMarker = function (restaurant) {
      var position = new google.maps.LatLng(restaurant.lat,restaurant.long);
      return new google.maps.Marker({
        position: position,
        map: this.state.map
      });
    }.bind(this);
    return this.props.restaurants.map(createMarker);
  },
  render: function() {
    if(typeof markers !== "undefined") {
      markers.map(function (marker) {
        marker.setMap(null);
      });
    }
    markers = this.addRestaurantMarkers();
    return (
      React.createElement("div", {className: "map-canvas"})
    );
  }
});



// Parent component for the whole app

var EatSafe = React.createClass({displayName: 'EatSafe',
  getInitialState: function() {
    // Initial state is no restaurants
    return {
      data: []
    };
  },
  makeAPIRequest: function(target, params) {
    // Issues AJAX request to the Flask backend, which queries the
    // EatSafe API (http://api.eatsafe.com/) and returns the result.
    var queryUrl = 'api/' + target;
    $.ajax({
      url: queryUrl,
      data: params,
      datatype: 'json',
      success: function(json) {
        this.setState({
          data: JSON.parse(json)
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },    
  render: function() {
    return (
      React.createElement("div", {id: "eatSafe"}, 
        React.createElement(RestaurantSearch, {onSubmit: this.makeAPIRequest, 
                          restaurants: this.state.data}), 
        React.createElement(MapCanvas, {restaurants: this.state.data})
      )
    );
  }
});

React.render(
  React.createElement(EatSafe, null),
  document.getElementById("content"));
