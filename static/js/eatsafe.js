var Restaurant = React.createClass({
  render: function() {
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
    var restaurantNodes =
    this.props.restaurants.map(function(restaurant) {
      return (
	<Restaurant data={restaurant} />
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
      Lat: <input type="text" ref="lat" defaultValue="41.9" />
      Long: <input type="text" ref="long" defaultValue="-87.6" />
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
