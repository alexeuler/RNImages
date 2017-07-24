import React from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { Observable } from 'rxjs'
import { pipe, range, map, prop } from 'ramda';
import axios from 'axios';

import RemoteImage, { eventNames } from '../RemoteImage';

const BASE_URL = "https://hardinhouses.com/listing-pics";

class Listing extends React.Component {

  constructor(props) {
    super(props)
    this.events = props.events
      .flatMap(id => Observable.from([
        { name: eventNames.LOAD_THUMB, target: `${id}:0` }, 
        { name: eventNames.LOAD_THUMB, target: `${id}:1` }, 
      ]))

  }

  renderItem({ item }) {
    return <RemoteImage {...item} />;
  }

  handleViewableItemsChanged = () => {

  }
  // medium@2x for large
  getItems = () =>
    pipe(
      range(0),
      map(index => ({
        id: `${this.props.id}:${index}`,
        thumbUrl: `${BASE_URL}/${this.props.ml}/preview-${this.props.ml}-${index + 10}.jpg`,
        fullUrl: `${BASE_URL}/${this.props.ml}/medium@2x-${this.props.ml}-${index + 10}.jpg`,
        events: this.events,
      })),
    )(this.props.pi)  

  render() {
    const items = this.getItems();
    return (
      <View>
        <FlatList
          data={items}
          renderItem={this.renderItem}
          keyExtractor={prop('id')}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          horizontal
          pagingEnabled
        />
      </View>
    )
  }
}

Listing.propTypes = {
  ml: PropTypes.string.isRequired,
  pi: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  events: PropTypes.object.isRequired,
}

export default Listing;
