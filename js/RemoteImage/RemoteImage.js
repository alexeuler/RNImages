import React from 'react';
import { CachedImage, ImageCache } from 'react-native-img-cache';
import PropTypes from 'prop-types';

const events = { LOAD_THUMB: 'LOAD_THUMB', LOAD_FULL: 'LOAD_FULL', UNLOAD_THUMB: 'UNLOAD_THUMB', UNLOAD_FULL: 'UNLOAD_FULL' }
const states = { EMPTY: 'EMPTY', RESOLVING: 'RESOLVING', RESOLVED: 'RESOLVED' }

class RemoteImage extends React.Component {
  constructor() {
    super();
    this.state = { 
      thumb: states.EMPTY,
      full: states.EMPTY,
    }
  }

  componentDidMount() {
    if (this.props.events) {
      this.subscription = 
        this.props.events
          .filter(event => event.target === this.props.id)
          .subscribe(this.handleEvent)
      ImageCache.get().on({ uri: this.props.thumbUrl }, this.thumbResolvedObserver, true)
      ImageCache.get().on({ uri: this.props.fullUrl }, this.fullResolvedObserver, true)
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
      ImageCache.get().dispose({ uri: this.props.thumbUrl }, this.thumbResolvedObserver);
      ImageCache.get().dispose({ uri: this.props.fullUrl }, this.fullResolvedObserver);
    }
  }

  thumbResolvedObserver = () => this.setState({ thumb: states.RESOLVED })
  fullResolvedObserver = () => this.setState({ full: states.RESOLVED })

  handleEvent = (event) => {
    switch (event.name) {
      case events.LOAD_THUMB: {
        if (this.state.thumb === states.EMPTY) this.setState({ thumb: states.RESOLVING });
        return;
      }
      case events.LOAD_FULL: {
        if (this.state.full === states.EMPTY) this.setState({ full: states.RESOLVING })
        return;
      }
      case events.UNLOAD_THUMB: {
        if (this.state.thumb === states.RESOLVING) {
          ImageCache.get().cancel(this.props.thumbUrl)
          this.setState({ thumb: states.EMPTY });
        }
      }
      case events.UNLOAD_FULL: {
        if (this.state.full === states.RESOLVING) {
          ImageCache.get().cancel(this.props.fullUrl)
          this.setState({ full: states.EMPTY });
        }
      }
    }
  }  

  render() {
    console.log('----------', this.props)
    if ((this.state.full === states.RESOLVED) || (this.state.full === states.RESOLVING)) {
      return <CachedImage source={{ uri: this.props.fullUrl }} />;
    }
    if ((this.state.thumb === states.RESOLVED) || (this.state.thumb === states.RESOLVING)) {
      return <CachedImage source={{ uri: this.props.thumbUrl }}/>;
    }
    return null;
  }
}

RemoteImage.propTypes = {
  thumbUrl: PropTypes.string.isRequired,
  fullUrl: PropTypes.string.isRequired,
  id: PropTypes.string,
  events: PropTypes.object,
}

export default RemoteImage;
