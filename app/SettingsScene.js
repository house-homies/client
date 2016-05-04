import React, {
  AsyncStorage,
  Alert,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

var Router = require('./Router.js');
var HORSE = require('./HORSE/HORSE.JS');

class SettingsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {username: ''};
  }

  componentDidMount() {
    AsyncStorage.getItem('username', (error, result) => {
      if (error) {
        this.setState({username: '[ERROR]'});
      } else {
        this.setState({username: result,});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>You are currently {this.state.username}.</Text>
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
          let newName = HORSE.RANDOMHORSENAME();
          AsyncStorage.setItem("username", newName);
          this.setState({username: newName});
        }}>
          <View>
            <Text style={styles.buttonText}>Reroll Username</Text>
          </View>
        </TouchableHighlight>

        <Text>Press the button below to leave the room. Make sure you have the access
        code if you need to rejoin!</Text>
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
          Alert.alert(
            'Are you sure?',
            'Once you leave this room, you\'ll need the access code to rejoin again.',
            [
              {text: 'Cancel', onPress: () => {}},
              {text: 'I\'m sure!', onPress: () => {
                AsyncStorage.removeItem('roomId');
                let route = Router.JoinRoomScene();
                this.props.navigator.replaceAtIndex(route, 0);
                this.props.navigator.popToTop();
              }}
            ]
          );
        }}>
          <View>
            <Text style={styles.buttonText}>Leave Room</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  button: {
    backgroundColor: 'gray',
    padding: 5,
  },
});

module.exports = SettingsScene;
