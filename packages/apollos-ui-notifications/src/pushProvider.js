import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { getHasPrompted, getPushPermissions } from './permissionUtils';

export const PushContext = React.createContext({
  hasPrompted: true,
  hasPushPermission: true,
  loading: true,
  checkPermissions: () => {}, // deprecated, confusing name
  updatePermissionStatus: () => {},
});

class Provider extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasPrompted: null,
      hasPushPermission: null,
      checkPermissions: () => {},
      updatePermissionStatus: () => {},
    };
  }

  async componentDidMount() {
    try {
      const permissionRes = await getPushPermissions();
      const promptRes = await getHasPrompted();
      this.setState({
        hasPrompted: promptRes,
        hasPushPermission: permissionRes,
        checkPermissions: this.update,
        updatePermissionStatus: this.update,
        loading: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  update = (onUpdate = () => null) => {
    this.setState(
      {
        loading: true,
      },
      () => {
        getPushPermissions().then((permissionRes) => {
          getHasPrompted().then((promptRes) => {
            this.setState({
              hasPrompted: promptRes,
              hasPushPermission: permissionRes,
              loading: false,
            });
          });
        });
        onUpdate();
      }
    );
  };

  render() {
    return (
      <PushContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </PushContext.Provider>
    );
  }
}

export const PushConsumer = PushContext.Consumer;

export default Provider;
