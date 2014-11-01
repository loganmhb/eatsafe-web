var Restaurant = React.createClass({
  render: function() {
    return (
      <div className="restaurant">
      <h2>{this.props.name}</h2>
      <p>Recieved a rating of {this.props.rating}.</p>
      </div>
    );
  }
});

var RestaurantList = React.createClass({
  render: function() {
    var restaurantNodes =
    this.props.restaurants.map(function(restaurant) {
      return (
	<Restaurant name={restaurant['name']} rating={restaurant['rating']} />
      );
    });
    return (
      <div className="restaurantList">
      {restaurantNodes}
      </div>
    );
  }
});

var SearchBox = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit(
      'near',
      {lat: this.refs.lat.getDOMNode().value,
       long: this.refs.long.getDOMNode().value}
    );
    return;
  },
  render: function() {
    return (
      <form id="searchBox" onSubmit={this.handleSubmit}>
      Lat: <input type="text" ref="lat" />
      Long: <input type="text" ref="long" />
      <input type="submit" value="Search" />
      </form>
    );
  }
});

var EatSafe = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  makeAPIRequest: function(target, params) {
    var queryString = '?';
    for (var i in params) {
      queryString += i + '=' + params[i] + '&';
    }
    queryString = queryString.slice(0, -1); // take off trailing '&'
    var queryUrl = 'api/' + target + queryString;
    $.ajax({
      url: queryUrl,
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
    console.log(this.state.data);
    return (
      <div id="eatSafe">
      <SearchBox onSubmit={this.makeAPIRequest}/>
      <RestaurantList restaurants={this.state.data}/>
      </div>
    );
  }
});

React.render(
  <EatSafe />,
  document.getElementById("content"));
