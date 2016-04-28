import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

var Router = require('./Router.js');

class JoinRoomScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: text.joinExistingDefault,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{
          let route = Router.MessengerScene();
          this.props.navigator.replace(route); 
        }}>
          <View>
            <Text style={styles.buttonText}>Join</Text>
          </View>
        </TouchableHighlight>
        <Text>
          OR
        </Text>
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{}}>
          <View>
            <Text style={styles.buttonText}>Generate New Building</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const text = {
  joinExistingDefault: 'Join existing building',
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

module.exports = JoinRoomScene;
