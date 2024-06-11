import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const TemperatureScreen = () => {
  const navigation = useNavigation();
  const [temperature, setTemperature] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleTemperatureInput = (text: React.SetStateAction<string>) => {
    setTemperature(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${temperature}°C`);
  };
  const goToFanScreen = () => {
    navigation.navigate('FanScreen' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textdisplay}>Nhiệt độ trong phòng hiện tại</Text>
      <View style={styles.circle}>
        <Text style={styles.circleText}>{displayText || '0°C'}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleTemperatureInput}
          value={temperature}
          placeholder="Nhập nhiệt độ"
          keyboardType="numeric"
        />
        <View style={{gap: 10}}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToFanScreen}>
            <Text style={styles.buttonText}>Thiết bị</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#99D9F2',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 45,
    width: 330,
    margin: 12,
    borderWidth: 1.5,
    borderRadius: 20,
    borderColor: 'white',
    padding: 10,
  },
  textdisplay: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 13,
    borderRadius: 20,
    width: 330,
    height: 45,
    marginLeft: 12,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  circle: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 200,
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
  },
  circleText: {
    fontSize: 30,
    color: 'black',
  },
});

export default TemperatureScreen;
