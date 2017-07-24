import React from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Subject } from 'rxjs'
import axios from 'axios';
import { pipe, prop, map, range } from 'ramda';
import { ImageCache } from 'react-native-img-cache';

import Listing from "./Listing";

const THUMBS_WINDOW = 7
const FULL_WINDOW = 3

class Listings extends React.Component {

  constructor(props) {
    super(props);
    this.events = new Subject();
    this.state = { listings: [] };
    ImageCache.get().clear();
  }

  componentDidMount() {
    axios.get('https://hardinhouses.com/listings.json')
      .then(res => this.setState({ listings: res.data }))
  }

  handleViewableItemsChanged = (items) => {
    const events = pipe(
      prop('viewableItems'),
      map(prop('index')),
      indices => ({min: Math.min(...indices) - THUMBS_WINDOW, max: Math.max(...indices)}),
      ({ min, max }) => range(
        Math.max(min - THUMBS_WINDOW, 0),
        Math.min(max + 1 + THUMBS_WINDOW, this.state.listings.length + 1)
      ),
    )(items)
    events.map(ev => this.events.next(ev))
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
