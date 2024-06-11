import React, {useState} from 'react';
import {View, Switch, StyleSheet, Image, Text} from 'react-native';
import {images} from '../../assets/image/const';

const FanScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Image
        style={styles.fanImage}
        source={isEnabled ? images.fanON : images.fan}
      />
      <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={{paddingTop: 10, fontSize: 18}}>
        {isEnabled ? 'Fan is ON' : 'Fan is OFF'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  fanImage: {
    width: 400,
    height: 400,
    marginBottom: 10,
  },
});

export default FanScreen;
