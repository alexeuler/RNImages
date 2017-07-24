import React from 'react';
import { CachedImage, ImageCache } from 'react-native-img-cache';
import { Image, Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';

export const events = { LOAD_THUMB: 'LOAD_THUMB', LOAD_FULL: 'LOAD_FULL', UNLOAD_THUMB: 'UNLOAD_THUMB', UNLOAD_FULL: 'UNLOAD_FULL' }
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
    this.mounted = true;
    if (this.props.events) {
      this.subscription = 
        this.props.events
          .filter(event => event.target === this.props.id)
          .subscribe(this.handleEvent, console.log)
      ImageCache.get().on({ uri: this.props.thumbUrl }, this.thumbResolvedObserver, true)
      ImageCache.get().on({ uri: this.props.fullUrl }, this.fullResolvedObserver, true)
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  thumbResolvedObserver = () => {
    if (!this.mounted) {
      ImageCache.get().dispose({ uri: this.props.thumbUrl }, this.thumbResolvedObserver);
      return;
    }
    if (this.state.thumb === states.RESOLVING) this.setState({ thumb: states.RESOLVED })
  }

  fullResolvedObserver = () => {
    if (!this.mounted) {
      ImageCache.get().dispose({ uri: this.props.fullUrl }, this.fullResolvedObserver);
      return;
    }
    if (this.state.full === states.RESOLVING) this.setState({ full: states.RESOLVED });
  }

  handleEvent = (event) => {
    // console.log('Handling', event, 'for', this.props.id);
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
    // console.log("Rendering", this.props.id, this.state);
    const style = { width: Dimensions.get('window').width, height: Dimensions.get('window').width };
    if ((this.state.full === states.RESOLVED) || (this.state.full === states.RESOLVING)) {
      debugger;
      return <CachedImage source={{ uri: this.props.fullUrl }} style={style} />;
    }
    if ((this.state.thumb === states.RESOLVED) || (this.state.thumb === states.RESOLVING)) {
      return <CachedImage source={{ uri: this.props.thumbUrl }} style={style} />;
    }
    return <View style={style}></View>;
  }
}

RemoteImage.propTypes = {
  thumbUrl: PropTypes.string.isRequired,
  fullUrl: PropTypes.string.isRequired,
  id: PropTypes.string,
  events: PropTypes.object,
}

export default RemoteImage;
