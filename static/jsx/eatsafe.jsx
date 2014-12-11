/* EatSafe Web -- Frontend access to Chicago health inspection data 
   employing the EatSafe API at api.eatsafechicago.com,
   with Google Maps integration.  */

var markers; // Hack alert -- workaround to ensure markers can be deleted after use

var Restaurant = React.createClass({
  render: function() {
    // Get the picture from Yelp if available; otherwise use a placeholder.
    var picUrl = this.props.data.pic !== "" ?
      this.props.data.pic : "static/img/nopic.png";
    return (
      <div className="restaurant">
        <img className="yelpPic" src={picUrl} />
        <h3>{this.props.data.name}</h3>
        <p>Recieved a rating of {this.props.data.rating}.</p>
      </div>
    );
  }
});

var RestaurantList = React.createClass({
  render: function() {
    /* Output a list of Restaurant components, passing each object
       to the corresponding restaurant as a prop. */
    var restaurantNodes =
    this.props.restaurants.map(function(restaurant) {
      return (
	<Restaurant data={restaurant} key={restaurant.id} />
      );
    });
    return (
      <div className="restaurantList">
        {restaurantNodes}
      </div>
    );
  }
});

// SearchForm takes a callback from EatSafe in order to query the API
// on form submit.

var SearchInput = React.createClass({
  render: function() {
    if(this.props.APITarget == "instant") {
      return (
        <input type="text" ref="query" />
      );
    } else if(this.props.APITarget == "near") {
      return (
        <div className="latLongInput">
          Lat: <input type="number" defaultValue="41.903196" ref="lat" />
          Long: <input type="number" defaultValue="-87.625916" ref="long" />
        </div>
      );
    }
  }
});

var SearchForm = React.createClass({
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
      <form id="searchForm" onSubmit={this.handleSubmit}>
        <select defaultValue="near" ref="target" onChange={this.handleChange}>
          <option value="instant">Keyword</option>
          <option value="near">Location</option>
        </select>
        <SearchInput ref="input" APITarget={this.state.target} />
        <input type="submit" />
      </form>
    );
  }
});


// Container to hold RestaurantList and SearchBox for display purposes

var RestaurantSearch = React.createClass({
  render: function() {
    return (
      <div className="restaurantSearch">
        <SearchForm onSubmit={this.props.onSubmit} />
        <RestaurantList restaurants={this.props.restaurants} />
      </div>
    );
  }
});

// Google Maps interface component

var MapCanvas = React.createClass({
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
      <div className="map-canvas"></div>
    );
  }
});



// Parent component for the whole app

var EatSafe = React.createClass({
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
      <div id="eatSafe">
        <RestaurantSearch onSubmit={this.makeAPIRequest}
                          restaurants={this.state.data} />
        <MapCanvas restaurants={this.state.data} />
      </div>
    );
  }
});

React.render(
  <EatSafe />,
  document.getElementById("content"));
