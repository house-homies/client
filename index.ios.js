/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class HouseHomies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: text.joinExistingDefault,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
        <TouchableHighlight underlayColor={'white'} style={styles.button} onPress={()=>{}}>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: 'gray',
    padding: 5,
  },
});

AppRegistry.registerComponent('HouseHomies', () => HouseHomies);
