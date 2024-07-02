import {useNavigation} from '@react-navigation/native';
import {createClient} from '@supabase/supabase-js';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import {fetchWeatherApi} from 'openmeteo';
import axios from 'axios';
import moment from 'moment';
import {Weather} from './weather';
const TemperatureScreen = () => {
  const navigation = useNavigation();

  const [temperatureToOpenFan, setTemperatureToOpenFan] = useState('');

  const [temperature, setTemperature] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [position, setPosition] = useState<Geolocation.GeoPosition>();
  const [weather, setWeather] = useState<
    Array<{
      time: string;
      temperature: number;
    }>
  >();
  const [currentWeather, setCurrentWeather] = useState<{
    time: string;
    temperature: number;
  }>();
  const handleTemperatureInput = (text: React.SetStateAction<string>) => {
    setTemperature(text);
  };
  const handleSubmit = () => {
    setDisplayText(`${temperature}°C`);
  };
  const goToFanScreen = () => {
    navigation.navigate(
      'FanScreen' as never,
      {
        temperatureToOpenFan: temperatureToOpenFan,
        currentTem: temperature,
      } as never,
    );
  };

  const supabaseUrl = 'https://atamzgfzgyynoqqdnbup.supabase.co';
  const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0YW16Z2Z6Z3l5bm9xcWRuYnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyOTg0NDEsImV4cCI6MjAzNDg3NDQ0MX0.Ner2Wvuop0mILVgNkhI_Q0_XNgzC32pKRTkAhQlWA2I';
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      detectSessionInUrl: false,
    },
  });

  const fetchData = async () => {
    const {data, error} = await supabase
      .schema('public')
      .from('temperature')
      .select('*')
      .order('id', {ascending: false})
      .limit(1);

    if (error) {
      console.error(error);
    } else {
      console.log('Data', data);
      setTemperatureToOpenFan(data[0].value);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const channels = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'temperature'},
        payload => {
          console.log('Change received!', payload);
          fetchData();
        },
      )
      .subscribe();
    return () => {
      channels.unsubscribe();
    };
    // return channels.unsubscribe();
  }, []);

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    handleCalculateCurrentTemperature();
  }, [weather]);

  const getWeather = async (lat: number, long: number) => {
    const params = {
      latitude: lat,
      longitude: long,
      hourly: 'temperature_2m',
      forecast_days: 1,
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    try {
      const responses = await axios.get(url, {
        params,
      });
      const res = responses.data as Weather;
      const data: Array<{
        time: string;
        temperature: number;
      }> = [];
      res.hourly.time.forEach((item, index) => {
        data.push({
          time: moment(item).format('HH:mm'),
          temperature: res.hourly.temperature_2m[index],
        });
      });
      return data;
    } catch (error) {
      console.table('err', error);
    }
  };

  const handleCalculateCurrentTemperature = async () => {
    let currentHours = moment().hours();
    let currentMinutes = moment().minutes();
    const hours =
      currentMinutes > 30 ? `${currentHours + 1}:00` : `${currentHours}:00`;
    const currentTemp = weather?.find(item => item.time === hours);
    if (!!currentTemp) {
      setDisplayText(currentTemp?.temperature.toString() + '°C');
      setCurrentWeather(currentTemp as any);
    }
  };

  const getLocation = async () => {
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
      console.log('result', result);
    });
    Geolocation.getCurrentPosition(
      async position => {
        console.log(position);
        setPosition(position);
        const weather = await getWeather(
          position.coords.latitude,
          position.coords.longitude,
        );
        console.log('weather', weather);
        setWeather(weather);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleGotoChart = () => {
    const chartData: Array<any> = [];
    weather?.forEach((item, index) => {
      if (
        index === 0 ||
        index === 4 ||
        index === 8 ||
        index === 12 ||
        index === 16 ||
        index === 20 ||
        index === 23
      ) {
        chartData.push(item);
      }
    });
    navigation.navigate('Chart', {
      currentWeather: currentWeather,
      weather: weather,
      chartData: chartData,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textdisplay}>Current position :</Text>
      <Text style={styles.textdisplay}>
        Latitude : {position?.coords.latitude}, Longitude :{' '}
        {position?.coords.longitude}
      </Text>

      <Text style={styles.textdisplay}>
        Ngưỡng tự động bật : {temperatureToOpenFan}
      </Text>
      <Text style={styles.textdisplay}>Nhiệt độ trong phòng hiện tại</Text>
      <View style={styles.circle}>
        <Text style={styles.circleText}>{displayText || '0°C'}</Text>
      </View>
      <View style={styles.inputContainer}>
        {/* <TextInput
          style={styles.input}
          onChangeText={handleTemperatureInput}
          value={temperature}
          placeholder="Nhập nhiệt độ"
          keyboardType="numeric"
        /> */}
        <View style={{gap: 10}}>
          {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={goToFanScreen}>
            <Text style={styles.buttonText}>Thiết bị</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGotoChart}>
            <Text style={styles.buttonText}>Chart</Text>
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
