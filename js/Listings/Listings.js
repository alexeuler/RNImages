import React from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs'
import axios from 'axios';

import Listing from "./Listing";

class Listings extends React.Component {

  constructor(props) {
    super(props);
    this.events = Observable.create(obs =>
      this.emit = obs.next.bind(obs)
    );
    this.state = { listings: [] };
  }

  componentDidMount() {
    axios.get('https://hardinhouses.com/listings.json')
      .then(res => this.setState({ listings: res.data }))
  }

  handleViewableItemsChanged = (items) => {
    // console.log(items);
  }

  renderItem = ({ item, index }) => {
    return <Listing id={index} events={this.events} {...item} />;
  }

  render() {
    return (
      <View>
        <Text>Listings</Text>
        <FlatList
          data={this.state.listings}
          initialNumToRender={3}
          windowSize={5}
          renderItem={this.renderItem}
          keyExtractor={listing => listing.ml}
          onViewableItemsChanged={this.handleViewableItemsChanged}
        />
      </View>
    )
  }
}

Listings.propTypes = {

}

export default Listings;
