/* EatSafe Web -- Frontend access to Chicago health inspection data 
   employing the EatSafe API at api.eatsafechicago.com,
   with Google Maps integration.  */

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

// SearchForm takes a callback from EatSafe in order to query the API
// on form submit.

var SearchInput = React.createClass({displayName: 'SearchInput',
  render: function() {
    if(this.props.APITarget == "instant") {
      return (
        React.createElement("input", {type: "text", ref: "query"})
      );
    } else if(this.props.APITarget == "near") {
      return (
        React.createElement("div", {className: "latLongInput"}, 
          "Lat: ", React.createElement("input", {type: "number", defaultValue: "41.903196", ref: "lat"}), 
          "Long: ", React.createElement("input", {type: "number", defaultValue: "-87.625916", ref: "long"})
        )
      );
    }
  }
});

var SearchForm = React.createClass({displayName: 'SearchForm',
  getInitialState: function() {
    return({
      target: 'near'
    });
  },
  handleSubmit: function(e) {
    // Don't post the form.
    e.preventDefault();
    // Query the API through callback.
    var params;
    // Ugh gross FIXME this data flow can't be right
    if(this.state.target === "instant") {
      params = {query: this.refs.input.refs.query.getDOMNode().value};
    } else {
      params = {lat: this.refs.input.refs.lat.getDOMNode().value,
                long: this.refs.input.refs.long.getDOMNode().value};
    }
    this.props.onSubmit(this.state.target, params);
    return;
  },
  handleChange: function() {
    this.setState({
      target: this.refs.target.getDOMNode().value
    });
  },
  render: function() {
    return (
      React.createElement("form", {id: "searchForm", onSubmit: this.handleSubmit}, 
        React.createElement("select", {defaultValue: "near", ref: "target", onChange: this.handleChange}, 
          React.createElement("option", {value: "instant"}, "Keyword"), 
          React.createElement("option", {value: "near"}, "Location")
        ), 
        React.createElement(SearchInput, {ref: "input", APITarget: this.state.target}), 
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
        React.createElement(SearchForm, {onSubmit: this.props.onSubmit}), 
        React.createElement(RestaurantList, {restaurants: this.props.restaurants})
      )
    );
  }
});

// Google Maps interface component

var MapCanvas = React.createClass({displayName: 'MapCanvas',
  getInitialState: function() {
    return {
      map: {}, // Don't request the map before mounting
      markers: []
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
  addRestaurantMarkers: function(restaurants) {
    var createMarker = function (restaurant) {
      var position = new google.maps.LatLng(restaurant.lat,restaurant.long);
      return new google.maps.Marker({
        position: position,
        map: this.state.map
      });
    }.bind(this);
    if (typeof restaurants !== "undefined") {
      return restaurants.map(createMarker);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.state.markers.map(function (marker) {
      marker.setMap(null);
    });
    this.setState({
      map: this.state.map,
      markers: this.addRestaurantMarkers(nextProps.restauarants)
    });
  },
  render: function() {
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
