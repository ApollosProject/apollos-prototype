import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';

export default function withWindow(ComponentToWrap) {
  return class WithWindow extends PureComponent {
    state = {
      window: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      },
    };

    componentDidMount() {
      Dimensions.addEventListener('change', this.handler);
    }

    componentWillUnmount() {
      Dimensions.removeEventListener('change', this.handler);
    }

    handler = ({ window }) => {
      if (
        // detect orientation change
        window.width === this.state.window.height &&
        window.height === this.state.window.width
      ) {
        return;
      }
      this.setState({ window });
    };

    render() {
      return <ComponentToWrap {...this.state} {...this.props} />;
    }
  };
}
