import React, {
  StatusBar,
  Platform,
} from 'react-native';

var Button = require('react-native-button');

let Router = {
  MessengerScene() {
    return {
      getSceneClass() {
        return require('./MessengerScene');
      },
      getTitle() {
        return 'House Homies';
      },
      renderRightButton(navigator) {
        return (
          <Button onPress={() => {
            let route = Router.SettingsScene();
            navigator.push(route);
          }}>
            Settings
          </Button>
        );
      },
    };
  },

  SettingsScene() {
    return {
      getSceneClass() {
        return require('./SettingsScene');
      },
      getTitle() {
        return 'Settings';
      }
    }
  },

  JoinRoomScene() {
    return {
      getSceneClass() {
        return require('./JoinRoomScene');
      },
      getTitle() {
        return 'Join Room';
      }
    }
  },
};


module.exports = Router;
