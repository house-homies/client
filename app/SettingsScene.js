import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

var Router = require('./Router.js');

class SettingsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {username: '[User Identifier]'};
  }

  goBack() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>You are currently {this.state.username}.</Text>
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
          var currentName = this.state.username;
          var newName = currentName == '[User Identifier]' ?
                        '[Other User Identifier]' : '[User Identifier]';
          this.setState({username: newName});
        }}>
          <View>
            <Text style={styles.buttonText}>Reroll Username</Text>
          </View>
        </TouchableHighlight>

        <Text>Press the button below to leave the room. Make sure you have the access
        code if you need to rejoin!</Text>
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
          let route = Router.JoinRoomScene();
          this.props.navigator.replaceAtIndex(route, 0);
          this.props.navigator.popToTop();
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
