import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>السلام عليكم ورحمة الله وبركاته!</Text>
      <Text style={styles.sub_text}>React Native is here!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24, 
    textAlign: 'center',
  },
  sub_text: {
    fontSize: 20,
    textAlign: 'center',
    padding: '2',
    color: '#c1121f',
  },
});
