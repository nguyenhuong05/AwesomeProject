import {useRoute} from '@react-navigation/native';
import {Dimensions, FlatList, SafeAreaView, Text, View} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
export const Chart = () => {
  const route = useRoute();
  const params = route.params as any;
  const chartDart = params?.chartData || [];
  const indexOfCurrent = params?.weather?.findIndex(
    (item: any) => item.time === params?.currentWeather?.time,
  );
  const weather = params?.weather?.slice(indexOfCurrent) || [];

  return (
    <SafeAreaView
      style={{
        gap: 20,
      }}>
      <View>
        <Text>Temperature Line Chart</Text>
        <LineChart
          data={{
            labels: chartDart.map((item: any) => item.time),
            datasets: [
              {
                data: chartDart.map((item: any) => item.temperature),
                strokeWidth: 2,
              },
            ],
          }}
          width={Dimensions.get('window').width - 10} // from react-native
          height={300}
          // yAxisLabel="$"
          yAxisSuffix="C"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            alignSelf: 'center',
          }}
        />
      </View>

      <FlatList
        data={weather}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 10,
        }}
        renderItem={({item, index}) => (
          <View style={{padding: 5, borderWidth: 1}}>
            <Text>{index === 0 ? 'Now' : item.time}</Text>

            <Text>{item.temperature}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const data = [
  {temperature: 29.3, time: '00:00'},
  //   {temperature: 30.4, time: '01:00'},
  //   {temperature: 31.3, time: '02:00'},
  //   {temperature: 32.7, time: '03:00'},
  {temperature: 33.5, time: '04:00'},
  //   {temperature: 34.1, time: '05:00'},
  //   {temperature: 34.4, time: '06:00'},
  //   {temperature: 34.4, time: '07:00'},
  {temperature: 32.9, time: '08:00'},
  // {temperature: 33.1, time: '09:00'},
  // {temperature: 33, time: '10:00'},
  // {temperature: 31.9, time: '11:00'},
  {temperature: 30.7, time: '12:00'},
  // {temperature: 29.1, time: '13:00'},
  // {temperature: 28.9, time: '14:00'},
  // {temperature: 28.6, time: '15:00'},
  {temperature: 28.5, time: '16:00'},
  // {temperature: 28.3, time: '17:00'},
  // {temperature: 27.9, time: '18:00'},
  // {temperature: 27.5, time: '19:00'},
  {temperature: 27.4, time: '20:00'},
  // {temperature: 27.4, time: '21:00'},
  // {temperature: 27.4, time: '22:00'},
  {temperature: 27.4, time: '23:00'},
];
