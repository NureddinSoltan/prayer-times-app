



// The real app :)

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState({});
//   const [selectedPrayer, setSelectedPrayer] = useState(null);
//   const [delay, setDelay] = useState('');
//   const [delays, setDelays] = useState({});
//   const [error, setError] = useState(null);
//   const [isTesting, setIsTesting] = useState(false); // Toggle for testing mode
//   const [editedTime, setEditedTime] = useState(''); // For editing prayer times

//   useEffect(() => {
//     fetchPrayerTimes();
//     loadDelays();
//   }, []);

//   const loadDelays = async () => {
//     try {
//       const storedDelays = await AsyncStorage.getItem('prayerDelays');
//       if (storedDelays) {
//         setDelays(JSON.parse(storedDelays));
//       }
//     } catch (err) {
//       console.error('Failed to load delays:', err);
//     }
//   };

//   const saveDelays = async (newDelays) => {
//     try {
//       await AsyncStorage.setItem('prayerDelays', JSON.stringify(newDelays));
//     } catch (err) {
//       console.error('Failed to save delays:', err);
//     }
//   };

//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: {
//           city: '41.021988',
//           country: '28.660188',
//           // latitude: '41.021988',
//           // longitude: '28.660188',
//           // city: 'istanbul',
//           // country: 'turkey',

//           method: 13, // Calculation method (adjust as needed)
//         },
//       });
//       setPrayerTimes(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   const setPrayerDelay = async () => {
//     if (!selectedPrayer || !delay) {
//       Alert.alert('Error', 'Please select a prayer and enter a delay.');
//       return;
//     }

//     const newDelays = { ...delays, [selectedPrayer]: parseInt(delay, 10) };
//     setDelays(newDelays);
//     await saveDelays(newDelays);

//     Alert.alert('Delay Saved', `Delay for ${selectedPrayer} set to ${delay} minutes.`);
//   };

//   const editPrayerTime = () => {
//     if (!selectedPrayer || !editedTime.match(/^\d{2}:\d{2}$/)) {
//       Alert.alert('Error', 'Please select a prayer and enter a valid time in HH:mm format.');
//       return;
//     }

//     const newPrayerTimes = { ...prayerTimes, [selectedPrayer]: editedTime };
//     setPrayerTimes(newPrayerTimes);

//     Alert.alert('Prayer Time Updated', `${selectedPrayer} time set to ${editedTime}.`);
//   };

//   const scheduleNotifications = async () => {
//     const hasPermission = await Notifications.getPermissionsAsync();
//     if (hasPermission.status !== 'granted') {
//       await Notifications.requestPermissionsAsync();
//     }

//     Object.entries(prayerTimes).forEach(async ([prayer, time]) => {
//       const prayerDelay = delays[prayer] || 0;
//       const [hours, minutes] = time.split(':').map(Number);
//       const notificationTime = new Date();
//       notificationTime.setHours(hours, minutes, 0, 0);
//       notificationTime.setMinutes(notificationTime.getMinutes() + prayerDelay);

//       if (notificationTime > new Date()) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Time for ${prayer}`,
//             body: `This is your notification for ${prayer} prayer.`,
//             sound: true,
//           },
//           trigger: notificationTime,
//         });
//         console.log(`Scheduled notification for ${prayer} at ${notificationTime}`);
//       }
//     });

//     Alert.alert('Notifications Scheduled', 'Notifications have been scheduled for all prayers.');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>
//         {isTesting ? 'Testing Mode: Edit Prayer Times' : 'Prayer Times'}
//       </Text>
//       <Button
//         title={`Switch to ${isTesting ? 'Normal' : 'Testing'} Mode`}
//         onPress={() => setIsTesting(!isTesting)}
//       />
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={Object.entries(prayerTimes)}
//             keyExtractor={(item) => item[0]}
//             renderItem={({ item }) => (
//               <Text
//                 style={[
//                   styles.item,
//                   selectedPrayer === item[0] && styles.selectedItem,
//                 ]}
//                 onPress={() => setSelectedPrayer(item[0])}
//               >
//                 {item[0]}: {item[1]} (Delay: {delays[item[0]] || 0} min)
//               </Text>
//             )}
//           />
//           {isTesting && (
//             <>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter new time (HH:mm)"
//                 value={editedTime}
//                 onChangeText={setEditedTime}
//                 keyboardType="numeric"
//               />
//               <Button title="Edit Prayer Time" onPress={editPrayerTime} />
//             </>
//           )}
//           <TextInput
//             style={styles.input}
//             placeholder="Enter delay in minutes"
//             value={delay}
//             onChangeText={setDelay}
//             keyboardType="numeric"
//           />
//           <Button title="Set Delay" onPress={setPrayerDelay} />
//           <Button title="Schedule Notifications" onPress={scheduleNotifications} />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 5,
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     textAlign: 'center',
//   },
//   selectedItem: {
//     backgroundColor: '#cce7ff',
//     borderColor: '#007bff',
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//   },
//   error: {
//     color: 'red',
//     fontSize: 16,
//   },
// });










// Different design:

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState({});
//   const [selectedPrayer, setSelectedPrayer] = useState(null);
//   const [delay, setDelay] = useState('');
//   const [delays, setDelays] = useState({});
//   const [error, setError] = useState(null);
//   const [isTesting, setIsTesting] = useState(false); // Toggle for testing mode
//   const [editedTime, setEditedTime] = useState(''); // For editing prayer times

//   useEffect(() => {
//     fetchPrayerTimes();
//     loadDelays();
//   }, []);

//   const loadDelays = async () => {
//     try {
//       const storedDelays = await AsyncStorage.getItem('prayerDelays');
//       if (storedDelays) {
//         setDelays(JSON.parse(storedDelays));
//       }
//     } catch (err) {
//       console.error('Failed to load delays:', err);
//     }
//   };

//   const saveDelays = async (newDelays) => {
//     try {
//       await AsyncStorage.setItem('prayerDelays', JSON.stringify(newDelays));
//     } catch (err) {
//       console.error('Failed to save delays:', err);
//     }
//   };

//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: {
//           city: '41.021988',
//           country: '28.660188',
//           // latitude: '41.021988',
//           // longitude: '28.660188',
//           // city: 'istanbul',
//           // country: 'turkey',

//           method: 13, // Calculation method (adjust as needed)
//         },
//       });
//       setPrayerTimes(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   const setPrayerDelay = async () => {
//     if (!selectedPrayer || !delay) {
//       Alert.alert('Error', 'Please select a prayer and enter a delay.');
//       return;
//     }

//     const newDelays = { ...delays, [selectedPrayer]: parseInt(delay, 10) };
//     setDelays(newDelays);
//     await saveDelays(newDelays);

//     Alert.alert('Delay Saved', `Delay for ${selectedPrayer} set to ${delay} minutes.`);
//   };

//   const editPrayerTime = () => {
//     if (!selectedPrayer || !editedTime.match(/^\d{2}:\d{2}$/)) {
//       Alert.alert('Error', 'Please select a prayer and enter a valid time in HH:mm format.');
//       return;
//     }

//     const newPrayerTimes = { ...prayerTimes, [selectedPrayer]: editedTime };
//     setPrayerTimes(newPrayerTimes);

//     Alert.alert('Prayer Time Updated', `${selectedPrayer} time set to ${editedTime}.`);
//   };

//   const scheduleNotifications = async () => {
//     const hasPermission = await Notifications.getPermissionsAsync();
//     if (hasPermission.status !== 'granted') {
//       await Notifications.requestPermissionsAsync();
//     }

//     Object.entries(prayerTimes).forEach(async ([prayer, time]) => {
//       const prayerDelay = delays[prayer] || 0;
//       const [hours, minutes] = time.split(':').map(Number);
//       const notificationTime = new Date();
//       notificationTime.setHours(hours, minutes, 0, 0);
//       notificationTime.setMinutes(notificationTime.getMinutes() + prayerDelay);

//       if (notificationTime > new Date()) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Time for ${prayer}`,
//             body: `This is your notification for ${prayer} prayer.`,
//             sound: true,
//           },
//           trigger: notificationTime,
//         });
//         console.log(`Scheduled notification for ${prayer} at ${notificationTime}`);
//       }
//     });

//     Alert.alert('Notifications Scheduled', 'Notifications have been scheduled for all prayers.');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>
//         {isTesting ? 'Testing Mode: Edit Prayer Times' : 'Prayer Times'}
//       </Text>
//       <Button
//         title={`Switch to ${isTesting ? 'Normal' : 'Testing'} Mode`}
//         onPress={() => setIsTesting(!isTesting)}
//       />
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={Object.entries(prayerTimes)}
//             keyExtractor={(item) => item[0]}
//             renderItem={({ item }) => (
//               <Text
//                 style={[
//                   styles.item,
//                   selectedPrayer === item[0] && styles.selectedItem,
//                 ]}
//                 onPress={() => setSelectedPrayer(item[0])}
//               >
//                 {item[0]}: {item[1]} (Delay: {delays[item[0]] || 0} min)
//               </Text>
//             )}
//           />
//           {isTesting && (
//             <>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter new time (HH:mm)"
//                 value={editedTime}
//                 onChangeText={setEditedTime}
//                 keyboardType="numeric"
//               />
//               <Button title="Edit Prayer Time" onPress={editPrayerTime} />
//             </>
//           )}
//           <TextInput
//             style={styles.input}
//             placeholder="Enter delay in minutes"
//             value={delay}
//             onChangeText={setDelay}
//             keyboardType="numeric"
//           />
//           <Button title="Set Delay" onPress={setPrayerDelay} />
//           <Button title="Schedule Notifications" onPress={scheduleNotifications} />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f4f8', // Light background color for a modern look
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#34495e', // Dark blue-gray text color
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 8,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#dcdfe6', // Light gray border
//     backgroundColor: '#ffffff', // White background for items
//     textAlign: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2, // Adds subtle elevation for Android
//   },
//   selectedItem: {
//     backgroundColor: '#e3f2fd', // Light blue background for selected items
//     borderColor: '#2196f3', // Blue border for selected items
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderColor: '#dcdfe6',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginVertical: 12,
//     backgroundColor: '#ffffff', // White background for inputs
//     fontSize: 16,
//   },
//   error: {
//     color: '#e74c3c', // Red color for error messages
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   button: {
//     marginVertical: 8,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
// });







// Without testing function

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState({});
//   const [selectedPrayer, setSelectedPrayer] = useState(null);
//   const [delay, setDelay] = useState('');
//   const [delays, setDelays] = useState({});
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchPrayerTimes();
//     loadDelays();
//   }, []);

//   const loadDelays = async () => {
//     try {
//       const storedDelays = await AsyncStorage.getItem('prayerDelays');
//       if (storedDelays) {
//         setDelays(JSON.parse(storedDelays));
//       }
//     } catch (err) {
//       console.error('Failed to load delays:', err);
//     }
//   };

//   const saveDelays = async (newDelays) => {
//     try {
//       await AsyncStorage.setItem('prayerDelays', JSON.stringify(newDelays));
//     } catch (err) {
//       console.error('Failed to save delays:', err);
//     }
//   };

//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: {
//           city: '41.021988',
//           country: '28.660188',
//           method: 13, // Calculation method (adjust as needed)
//         },
//       });
//       setPrayerTimes(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   const setPrayerDelay = async () => {
//     if (!selectedPrayer || !delay) {
//       Alert.alert('Error', 'Please select a prayer and enter a delay.');
//       return;
//     }

//     const newDelays = { ...delays, [selectedPrayer]: parseInt(delay, 10) };
//     setDelays(newDelays);
//     await saveDelays(newDelays);

//     Alert.alert('Delay Saved', `Delay for ${selectedPrayer} set to ${delay} minutes.`);
//   };

//   const scheduleNotifications = async () => {
//     const hasPermission = await Notifications.getPermissionsAsync();
//     if (hasPermission.status !== 'granted') {
//       await Notifications.requestPermissionsAsync();
//     }

//     Object.entries(prayerTimes).forEach(async ([prayer, time]) => {
//       const prayerDelay = delays[prayer] || 0;
//       const [hours, minutes] = time.split(':').map(Number);
//       const notificationTime = new Date();
//       notificationTime.setHours(hours, minutes, 0, 0);
//       notificationTime.setMinutes(notificationTime.getMinutes() + prayerDelay);

//       if (notificationTime > new Date()) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Time for ${prayer}`,
//             body: `This is your notification for ${prayer} prayer.`,
//             sound: true,
//           },
//           trigger: notificationTime,
//         });
//         console.log(`Scheduled notification for ${prayer} at ${notificationTime}`);
//       }
//     });

//     Alert.alert('Notifications Scheduled', 'Notifications have been scheduled for all prayers.');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Prayer Times</Text>
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={Object.entries(prayerTimes)}
//             keyExtractor={(item) => item[0]}
//             renderItem={({ item }) => (
//               <Text
//                 style={[
//                   styles.item,
//                   selectedPrayer === item[0] && styles.selectedItem,
//                 ]}
//                 onPress={() => setSelectedPrayer(item[0])}
//               >
//                 {item[0]}: {item[1]} (Delay: {delays[item[0]] || 0} min)
//               </Text>
//             )}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter delay in minutes"
//             value={delay}
//             onChangeText={setDelay}
//             keyboardType="numeric"
//           />
//           <Button title="Set Delay" onPress={setPrayerDelay} />
//           <Button title="Schedule Notifications" onPress={scheduleNotifications} />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f4f8',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#34495e',
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 8,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#dcdfe6',
//     backgroundColor: '#ffffff',
//     textAlign: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   selectedItem: {
//     backgroundColor: '#e3f2fd',
//     borderColor: '#2196f3',
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderColor: '#dcdfe6',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginVertical: 12,
//     backgroundColor: '#ffffff',
//     fontSize: 16,
//   },
//   error: {
//     color: '#e74c3c',
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
// });














// Fixing a bug wth chatgpt

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configure notifications to display while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [delay, setDelay] = useState('');
  const [delays, setDelays] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrayerTimes();
    loadDelays();
  }, []);

  const loadDelays = async () => {
    try {
      const storedDelays = await AsyncStorage.getItem('prayerDelays');
      if (storedDelays) {
        setDelays(JSON.parse(storedDelays));
      }
    } catch (err) {
      console.error('Failed to load delays:', err);
    }
  };

  const saveDelays = async (newDelays) => {
    try {
      await AsyncStorage.setItem('prayerDelays', JSON.stringify(newDelays));
    } catch (err) {
      console.error('Failed to save delays:', err);
    }
  };

  const fetchPrayerTimes = async () => {
    try {
      const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
        params: {
          city: '41.021988',
          country: '28.660188',
          method: 13, // Calculation method (adjust as needed)
        },
      });
      setPrayerTimes(response.data.data.timings);
    } catch (err) {
      setError('Failed to fetch prayer times. Please try again.');
      console.error(err);
    }
  };

  const setPrayerDelay = async () => {
    if (!selectedPrayer || !delay) {
      Alert.alert('Error', 'Please select a prayer and enter a delay.');
      return;
    }

    const newDelays = { ...delays, [selectedPrayer]: parseInt(delay, 10) };
    setDelays(newDelays);
    await saveDelays(newDelays);

    Alert.alert('Delay Saved', `Delay for ${selectedPrayer} set to ${delay} minutes.`);
  };

  const scheduleNotifications = async () => {
    // Clear all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications have been cleared.');
  
    const hasPermission = await Notifications.getPermissionsAsync();
    if (hasPermission.status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  
    // Filter prayers to schedule only specific ones
    const selectedPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const filteredPrayers = Object.entries(prayerTimes).filter(([prayer]) =>
      selectedPrayers.includes(prayer)
    );
  
    for (const [prayer, time] of filteredPrayers) {
      const prayerDelay = delays[prayer] || 0;
      const [hours, minutes] = time.split(':').map(Number);
  
      if (isNaN(hours) || isNaN(minutes)) {
        console.error(`Invalid time format for ${prayer}: ${time}`);
        continue;
      }
  
      const notificationTime = new Date();
      notificationTime.setHours(hours, minutes, 0, 0);
      notificationTime.setMinutes(notificationTime.getMinutes() + prayerDelay);
  
      if (notificationTime > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Time for ${prayer}`,
            body: `This is your notification for ${prayer} prayer.`,
            sound: true,
          },
          trigger: notificationTime,
        });
        console.log(`Scheduled notification for ${prayer} at ${notificationTime}`);
      }
    }
  
    Alert.alert('Notifications Scheduled', 'Notifications have been scheduled for selected prayers.');
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Times</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={Object.entries(prayerTimes)}
            keyExtractor={(item) => item[0]}
            renderItem={({ item }) => (
              <Text
                style={[
                  styles.item,
                  selectedPrayer === item[0] && styles.selectedItem,
                ]}
                onPress={() => setSelectedPrayer(item[0])}
              >
                {item[0]}: {item[1]} (Delay: {delays[item[0]] || 0} min)
              </Text>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter delay in minutes"
            value={delay}
            onChangeText={setDelay}
            keyboardType="numeric"
          />
          <Button title="Set Delay" onPress={setPrayerDelay} />
          <Button title="Schedule Notifications" onPress={scheduleNotifications} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#34495e',
  },
  item: {
    fontSize: 18,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcdfe6',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#dcdfe6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});






// Fixing bug with bolt:
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, ScrollView, Switch } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState({});
//   const [testTimes, setTestTimes] = useState({});
//   const [selectedPrayer, setSelectedPrayer] = useState(null);
//   const [delay, setDelay] = useState('');
//   const [delays, setDelays] = useState({});
//   const [error, setError] = useState(null);
//   const [testMode, setTestMode] = useState(false);
//   const [debugInfo, setDebugInfo] = useState({
//     currentTime: new Date().toLocaleTimeString(),
//     notificationStatus: 'unknown',
//     scheduledNotifications: [],
//     nextNotification: null,
//   });

//   useEffect(() => {
//     fetchPrayerTimes();
//     loadDelays();
//     loadTestTimes();
//     checkNotificationPermissions();
    
//     // Update current time every second
//     const timer = setInterval(() => {
//       updateDebugInfo();
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const loadTestTimes = async () => {
//     try {
//       const stored = await AsyncStorage.getItem('testTimes');
//       if (stored) {
//         setTestTimes(JSON.parse(stored));
//       }
//     } catch (err) {
//       console.error('Failed to load test times:', err);
//     }
//   };

//   const saveTestTimes = async (newTestTimes) => {
//     try {
//       await AsyncStorage.setItem('testTimes', JSON.stringify(newTestTimes));
//     } catch (err) {
//       console.error('Failed to save test times:', err);
//     }
//   };

//   const updateDebugInfo = async () => {
//     const now = new Date();
//     const currentTime = now.getHours() * 60 + now.getMinutes();
    
//     const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
//     let nextNotification = null;
//     const times = testMode ? testTimes : prayerTimes;
    
//     if (times && delays) {
//       const notifications = Object.entries(times)
//         .map(([prayer, time]) => {
//           const [hours, minutes] = time.split(':').map(Number);
//           const prayerTime = hours * 60 + minutes;
//           const delay = delays[prayer] || 0;
//           const notificationTime = prayerTime + delay;
//           return {
//             prayer,
//             notificationTime,
//             timeUntil: notificationTime - currentTime
//           };
//         })
//         .filter(n => n.timeUntil > 0)
//         .sort((a, b) => a.timeUntil - b.timeUntil);

//       nextNotification = notifications[0];
//     }

//     setDebugInfo({
//       currentTime: now.toLocaleTimeString(),
//       notificationStatus: (await Notifications.getPermissionsAsync()).status,
//       scheduledNotifications: scheduledNotifications.map(n => ({
//         title: n.content.title,
//         trigger: n.trigger,
//       })),
//       nextNotification,
//       testMode,
//       activeTimeSet: testMode ? 'Test Times' : 'Real Times',
//     });
//   };

//   const checkNotificationPermissions = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       const { status: newStatus } = await Notifications.requestPermissionsAsync();
//       if (newStatus !== 'granted') {
//         Alert.alert('Warning', 'Without notification permissions, you won\'t receive prayer time alerts.');
//       }
//     }
//   };

//   const loadDelays = async () => {
//     try {
//       const storedDelays = await AsyncStorage.getItem('prayerDelays');
//       if (storedDelays) {
//         setDelays(JSON.parse(storedDelays));
//       }
//     } catch (err) {
//       console.error('Failed to load delays:', err);
//     }
//   };

//   const saveDelays = async (newDelays) => {
//     try {
//       await AsyncStorage.setItem('prayerDelays', JSON.stringify(newDelays));
//     } catch (err) {
//       console.error('Failed to save delays:', err);
//     }
//   };

//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: {
//           city: '41.021988',
//           country: '28.660188',
//           method: 13,
//         },
//       });
//       const times = response.data.data.timings;
//       setPrayerTimes(times);
//       // Initialize test times if they don't exist
//       if (Object.keys(testTimes).length === 0) {
//         setTestTimes(times);
//         saveTestTimes(times);
//       }
//       updateDebugInfo();
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   const handleTimeChange = (prayer: string, time: string) => {
//     const newTestTimes = { ...testTimes, [prayer]: time };
//     setTestTimes(newTestTimes);
//     saveTestTimes(newTestTimes);
//     updateDebugInfo();
//   };

//   const setPrayerDelay = async () => {
//     if (!selectedPrayer || !delay) {
//       Alert.alert('Error', 'Please select a prayer and enter a delay.');
//       return;
//     }

//     const newDelays = { ...delays, [selectedPrayer]: parseInt(delay, 10) };
//     setDelays(newDelays);
//     await saveDelays(newDelays);
//     await scheduleNotifications();
//     updateDebugInfo();

//     Alert.alert('Delay Saved', `Delay for ${selectedPrayer} set to ${delay} minutes.`);
//   };

//   const scheduleNotifications = async () => {
//     try {
//       await Notifications.cancelAllScheduledNotificationsAsync();
//       console.log('All scheduled notifications have been cleared.');
    
//       const hasPermission = await Notifications.getPermissionsAsync();
//       if (hasPermission.status !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Error', 'Notification permissions not granted');
//           return;
//         }
//       }
    
//       const selectedPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
//       const times = testMode ? testTimes : prayerTimes;
//       const filteredPrayers = Object.entries(times).filter(([prayer]) =>
//         selectedPrayers.includes(prayer)
//       );
    
//       for (const [prayer, time] of filteredPrayers) {
//         const prayerDelay = delays[prayer] || 0;
//         const [hours, minutes] = time.split(':').map(Number);
    
//         if (isNaN(hours) || isNaN(minutes)) {
//           console.error(`Invalid time format for ${prayer}: ${time}`);
//           continue;
//         }
    
//         const notificationTime = new Date();
//         notificationTime.setHours(hours, minutes, 0, 0);
//         notificationTime.setMinutes(notificationTime.getMinutes() + prayerDelay);
    
//         if (notificationTime > new Date()) {
//           await Notifications.scheduleNotificationAsync({
//             content: {
//               title: `Time for ${prayer}`,
//               body: `This is your notification for ${prayer} prayer.`,
//               sound: true,
//             },
//             trigger: {
//               hour: notificationTime.getHours(),
//               minute: notificationTime.getMinutes(),
//               repeats: true,
//             },
//           });
//         }
//       }
    
//       updateDebugInfo();
//       Alert.alert('Success', 'Notifications have been scheduled successfully');
//     } catch (error) {
//       console.error('Error scheduling notifications:', error);
//       Alert.alert('Error', 'Failed to schedule notifications: ' + error.message);
//     }
//   };

//   const renderDebugInfo = () => (
//     <View style={styles.debugContainer}>
//       <Text style={styles.debugHeader}>Debug Information</Text>
//       <Text style={styles.debugText}>Current Time: {debugInfo.currentTime}</Text>
//       <Text style={styles.debugText}>Mode: {testMode ? 'Test' : 'Real'}</Text>
//       <Text style={styles.debugText}>Notification Permission: {debugInfo.notificationStatus}</Text>
      
//       <Text style={styles.debugSubHeader}>Next Notification:</Text>
//       {debugInfo.nextNotification ? (
//         <Text style={styles.debugText}>
//           {debugInfo.nextNotification.prayer} in {Math.floor(debugInfo.nextNotification.timeUntil / 60)}h {debugInfo.nextNotification.timeUntil % 60}m
//         </Text>
//       ) : (
//         <Text style={styles.debugText}>No upcoming notifications</Text>
//       )}

//       <Text style={styles.debugSubHeader}>Scheduled Notifications:</Text>
//       {debugInfo.scheduledNotifications.map((notification, index) => (
//         <Text key={index} style={styles.debugText}>
//           {notification.title} - {JSON.stringify(notification.trigger)}
//         </Text>
//       ))}
//     </View>
//   );
  
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Prayer Times</Text>
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           <View style={styles.testModeContainer}>
//             <Text style={styles.testModeText}>Test Mode</Text>
//             <Switch
//               value={testMode}
//               onValueChange={(value) => {
//                 setTestMode(value);
//                 scheduleNotifications();
//                 updateDebugInfo();
//               }}
//             />
//           </View>

//           <FlatList
//             data={Object.entries(testMode ? testTimes : prayerTimes)}
//             keyExtractor={(item) => item[0]}
//             renderItem={({ item: [prayer, time] }) => (
//               <View style={[styles.item, selectedPrayer === prayer && styles.selectedItem]}>
//                 <Text
//                   style={styles.prayerName}
//                   onPress={() => setSelectedPrayer(prayer)}
//                 >
//                   {prayer}
//                 </Text>
//                 {testMode ? (
//                   <TextInput
//                     style={styles.timeInput}
//                     value={time}
//                     onChangeText={(newTime) => handleTimeChange(prayer, newTime)}
//                     placeholder="HH:MM"
//                   />
//                 ) : (
//                   <Text style={styles.timeText}>{time}</Text>
//                 )}
//                 <Text style={styles.delayText}>
//                   Delay: {delays[prayer] || 0} min
//                 </Text>
//               </View>
//             )}
//             scrollEnabled={false}
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Enter delay in minutes"
//             value={delay}
//             onChangeText={setDelay}
//             keyboardType="numeric"
//           />

//           <View style={styles.buttonContainer}>
//             <Button title="Set Delay" onPress={setPrayerDelay} />
//             <Button title="Schedule Notifications" onPress={scheduleNotifications} />
//             <Button title="Refresh Times" onPress={fetchPrayerTimes} />
//           </View>

//           {renderDebugInfo()}
//         </>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f4f8',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#34495e',
//     marginTop: 40,
//   },
//   testModeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   testModeText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#34495e',
//   },
//   item: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 8,
//     padding: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#dcdfe6',
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   selectedItem: {
//     backgroundColor: '#e3f2fd',
//     borderColor: '#2196f3',
//   },
//   prayerName: {
//     fontSize: 16,
//     fontWeight: '500',
//     flex: 1,
//   },
//   timeInput: {
//     borderWidth: 1,
//     borderColor: '#dcdfe6',
//     borderRadius: 4,
//     padding: 4,
//     width: 80,
//     textAlign: 'center',
//     marginHorizontal: 10,
//   },
//   timeText: {
//     fontSize: 16,
//     marginHorizontal: 10,
//   },
//   delayText: {
//     fontSize: 14,
//     color: '#666',
//     width: 80,
//     textAlign: 'right',
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderColor: '#dcdfe6',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginVertical: 12,
//     backgroundColor: '#ffffff',
//     fontSize: 16,
//   },
//   error: {
//     color: '#e74c3c',
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     gap: 10,
//     marginBottom: 20,
//   },
//   debugContainer: {
//     backgroundColor: '#1a1a1a',
//     padding: 15,
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   debugHeader: {
//     color: '#00ff00',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   debugSubHeader: {
//     color: '#00ff00',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   debugText: {
//     color: '#ffffff',
//     fontSize: 14,
//     marginBottom: 5,
//     fontFamily: 'monospace',
//   },
// });


























































































// Claude

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, FlatList, Platform, Button, Alert } from 'react-native';
// import axios from 'axios';
// import * as Notifications from 'expo-notifications';
// import { format, parse, addMinutes, addSeconds } from 'date-fns';

// // Configure notifications
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState([]);
//   const [error, setError] = useState(null);
//   const [notificationStatus, setNotificationStatus] = useState('Not initialized');

//   useEffect(() => {
//     initializeNotifications();
//   }, []);

//   useEffect(() => {
//     if (Object.keys(prayerTimes).length > 0) {
//       scheduleNotifications();
//     }
//   }, [prayerTimes]);

//   const scheduleNotifications = async () => {
//     try {
//       // Cancel existing notifications
//       await Notifications.cancelAllScheduledNotificationsAsync();

//       // Define prayer times and their delays
//       const prayerDelays = {
//         Fajr: 20,
//         Dhuhr: 20,
//         Asr: 20,
//         Maghrib: 10,
//         Isha: 20,
//       };

//       // Get current date
//       const currentDate = new Date().toISOString().split('T')[0];

//       // Schedule notifications for each prayer
//       for (const [prayer, delay] of Object.entries(prayerDelays)) {
//         if (prayerTimes[prayer]) {
//           try {
//             const prayerTime = parse(
//               `${currentDate} ${prayerTimes[prayer]}`,
//               'yyyy-MM-dd HH:mm',
//               new Date()
//             );
//             const notificationTime = addMinutes(prayerTime, delay);

//             if (notificationTime > new Date()) {
//               const identifier = await Notifications.scheduleNotificationAsync({
//                 content: {
//                   title: `${prayer} Prayer Reminder`,
//                   body: `It's been ${delay} minutes since ${prayer} prayer time`,
//                   data: { prayer, delay },
//                 },
//                 trigger: {
//                   date: notificationTime,
//                 },
//               });
//               console.log(`Scheduled ${prayer} notification: ${identifier}`);
//             }
//           } catch (err) {
//             console.error(`Error scheduling ${prayer} notification:`, err);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error in scheduleNotifications:', err);
//       setNotificationStatus(`Schedule error: ${err.message}`);
//     }
//   };

//   const initializeNotifications = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('default', {
//           name: 'default',
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//         });
//       }

//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
      
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') {
//         setNotificationStatus('Permission not granted');
//         Alert.alert('Permission required', 'Please enable notifications to use this feature.');
//         return false;
//       }

//       setNotificationStatus('Permissions granted');
//       return true;
//     } catch (err) {
//       console.error('Error initializing notifications:', err);
//       setNotificationStatus(`Init error: ${err.message}`);
//       return false;
//     }
//   };

//   const scheduleTestNotification = async () => {
//     try {
//       // Schedule a test notification for 5 seconds from now
//       const identifier = await Notifications.scheduleNotificationAsync({
//         content: {
//           title: "Test Notification",
//           body: "This is a test notification (5 seconds)",
//           data: { type: 'test' },
//         },
//         trigger: { seconds: 5 },
//       });
      
//       console.log('Test notification scheduled:', identifier);
//       Alert.alert('Test Notification', 'Scheduled to appear in 5 seconds');
      
//       // Set up notification handler
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log('Notification received:', notification);
//       });

//       return identifier;
//     } catch (err) {
//       console.error('Error scheduling test notification:', err);
//       Alert.alert('Error', `Failed to schedule test: ${err.message}`);
//       return null;
//     }
//   };

//   const testImmediateNotification = async () => {
//     try {
//       await Notifications.presentNotificationAsync({
//         content: {
//           title: "Immediate Test",
//           body: "This should appear immediately",
//           data: { type: 'immediate' },
//         },
//       });
//       console.log('Immediate notification sent');
//     } catch (err) {
//       console.error('Error sending immediate notification:', err);
//       Alert.alert('Error', `Failed to send immediate notification: ${err.message}`);
//     }
//   };

//   const showDebugInfo = async () => {
//     try {
//       const scheduled = await Notifications.getAllScheduledNotificationsAsync();
//       const permissions = await Notifications.getPermissionsAsync();
      
//       const debugInfo = {
//         scheduledCount: scheduled.length,
//         permissions: permissions,
//         notificationStatus,
//         platform: Platform.OS,
//         version: Platform.Version,
//       };
      
//       console.log('Debug info:', debugInfo);
//       Alert.alert('Debug Info', JSON.stringify(debugInfo, null, 2));
//     } catch (err) {
//       console.error('Error getting debug info:', err);
//       Alert.alert('Error', `Failed to get debug info: ${err.message}`);
//     }
//   };

//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: {
//           city: '41.021988',
//           country: '28.660188',
//           method: 13,
//         },
//       });
//       setPrayerTimes(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchPrayerTimes();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Prayer Times</Text>
//       <Text style={styles.status}>Status: {notificationStatus}</Text>
      
//       <View style={styles.buttonContainer}>
//         <Button 
//           title="5s Test" 
//           onPress={scheduleTestNotification}
//         />
//         <Button 
//           title="Immediate Test" 
//           onPress={testImmediateNotification}
//         />
//         <Button 
//           title="Debug Info" 
//           onPress={showDebugInfo}
//         />
//       </View>

//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <FlatList
//           data={Object.entries(prayerTimes)}
//           keyExtractor={(item) => item[0]}
//           renderItem={({ item }) => (
//             <Text style={styles.item}>
//               {item[0]}: {item[1]}
//             </Text>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     marginTop: 40,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   status: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 10,
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 5,
//   },
//   error: {
//     color: 'red',
//     fontSize: 16,
//   },
// });
















































































// DeepSeek:


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { StyleSheet, Text, View, FlatList } from 'react-native';
// import * as Notifications from 'expo-notifications';

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     requestNotificationPermissions();
//     fetchPrayerTimes();
//   }, []);

//   const requestNotificationPermissions = async () => {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status !== 'granted') {
//       alert('You need to enable notifications to receive prayer time reminders.');
//     }
//   };

//   const scheduleNotifications = (prayerTimes) => {
//     const prayerNotifications = {
//       Fajr: 20,
//       Dhuhr: 20,
//       Asr: 20,
//       Maghrib: 10,
//       Isha: 20,
//     };

//     Object.entries(prayerNotifications).forEach(([prayer, minutes]) => {
//       const prayerTime = prayerTimes[prayer];
//       if (prayerTime) {
//         // Split the prayer time into hours and minutes
//         const [hour, minute] = prayerTime.split(':').map(Number);

//         // Calculate the notification time
//         const notificationTime = new Date();
//         notificationTime.setHours(hour);
//         notificationTime.setMinutes(minute + minutes);
//         notificationTime.setSeconds(0);

//         // Schedule the notification
//         Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Prayer Reminder`,
//             body: `It's time for ${prayer} prayer!`,
//             sound: true,
//           },
//           trigger: {
//             hour: notificationTime.getHours(),
//             minute: notificationTime.getMinutes(),
//             repeats: true,
//           },
//         });
//       }
//     });

//     // Log scheduled notifications for debugging
//     checkScheduledNotifications();
//   };

//   // Log scheduled notifications
//   const checkScheduledNotifications = async () => {
//     const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
//     console.log('Scheduled Notifications:', scheduledNotifications);
//   };

//   // Handle notifications when the app is in the foreground
//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       alert(notification.request.content.body);
//     });

//     return () => subscription.remove();
//   }, []);

//   // Fetch prayer times from the API
//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get(
//         'https://api.aladhan.com/v1/timingsByCity',
//         {
//           params: {
//             city: '41.021988',
//             country: '28.660188',
//             method: 13,
//           },
//         }
//       );
//       console.log('Fetched Prayer Times:', response.data.data.timings); // Log the fetched times
//       setPrayerTimes(response.data.data.timings);
//       scheduleNotifications(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Prayer Times</Text>
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <FlatList
//           data={Object.entries(prayerTimes)}
//           keyExtractor={(item) => item[0]}
//           renderItem={({ item }) => (
//             <Text style={styles.item}>
//               {item[0]}: {item[1]}
//             </Text>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 5,
//   },
//   error: {
//     color: 'red',
//     fontSize: 16,
//   },
// });













// Deep seek
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
// import * as Notifications from 'expo-notifications';

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState({});
//   const [error, setError] = useState(null);
//   const [isTestMode, setIsTestMode] = useState(false); // Toggle test mode
//   const [testPrayerTimes, setTestPrayerTimes] = useState({
//     Fajr: '06:50',
//     Dhuhr: '13:21',
//     Asr: '15:49',
//     Maghrib: '18:12',
//     Isha: '19:37',
//   });

//   useEffect(() => {
//     requestNotificationPermissions();
//     fetchPrayerTimes();
//   }, []);

//   const requestNotificationPermissions = async () => {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status !== 'granted') {
//       alert('You need to enable notifications to receive prayer time reminders.');
//     }
//   };

//   const scheduleNotifications = (prayerTimes) => {
//     const prayerNotifications = {
//       Fajr: 20,
//       Dhuhr: 20,
//       Asr: 20,
//       Maghrib: 10,
//       Isha: 20,
//     };

//     Object.entries(prayerNotifications).forEach(([prayer, minutes]) => {
//       const prayerTime = prayerTimes[prayer];
//       if (prayerTime) {
//         // Split the prayer time into hours and minutes
//         const [hour, minute] = prayerTime.split(':').map(Number);

//         // Calculate the notification time
//         const notificationTime = new Date();
//         notificationTime.setHours(hour);
//         notificationTime.setMinutes(minute + minutes);
//         notificationTime.setSeconds(0);

//         // Schedule the notification
//         Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Prayer Reminder`,
//             body: `It's time for ${prayer} prayer!`,
//             sound: true,
//           },
//           trigger: {
//             hour: notificationTime.getHours(),
//             minute: notificationTime.getMinutes(),
//             repeats: true,
//           },
//         });
//       }
//     });

//     // Log scheduled notifications for debugging
//     checkScheduledNotifications();
//   };

//   const checkScheduledNotifications = async () => {
//     const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
//     console.log('Scheduled Notifications:', scheduledNotifications);
//   };

//   // Handle notifications when the app is in the foreground
//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       alert(notification.request.content.body);
//     });

//     return () => subscription.remove();
//   }, []);

//   // Fetch prayer times from the API
//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get(
//         'https://api.aladhan.com/v1/timingsByCity',
//         {
//           params: {
//             city: '41.021988',
//             country: '28.660188',
//             method: 13,
//           },
//         }
//       );
//       console.log('Fetched Prayer Times:', response.data.data.timings);
//       setPrayerTimes(response.data.data.timings);
//       scheduleNotifications(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   // Toggle test mode
//   const toggleTestMode = () => {
//     setIsTestMode(!isTestMode);
//   };

//   // Handle changes in test prayer times
//   const handleTestPrayerTimeChange = (prayer, time) => {
//     setTestPrayerTimes({ ...testPrayerTimes, [prayer]: time });
//   };

//   // Render the test environment
//   const renderTestEnvironment = () => (
//     <>
//       <Text style={styles.subHeader}>Test Environment</Text>
//       {Object.entries(testPrayerTimes).map(([prayer, time]) => (
//         <View key={prayer} style={styles.inputContainer}>
//           <Text style={styles.label}>{prayer}:</Text>
//           <TextInput
//             style={styles.input}
//             value={time}
//             onChangeText={(text) => handleTestPrayerTimeChange(prayer, text)}
//             placeholder="HH:mm"
//           />
//         </View>
//       ))}
//       <Button
//         title="Schedule Notifications with Test Times"
//         onPress={() => scheduleNotifications(testPrayerTimes)}
//       />
//     </>
//   );

//   // Render the normal app view
//   const renderNormalView = () => (
//     <FlatList
//       data={Object.entries(prayerTimes)}
//       keyExtractor={(item) => item[0]}
//       renderItem={({ item }) => (
//         <Text style={styles.item}>
//           {item[0]}: {item[1]}
//         </Text>
//       )}
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Prayer Times</Text>
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           {isTestMode ? renderTestEnvironment() : renderNormalView()}
//           <Button
//             title={isTestMode ? "Exit Test Mode" : "Enter Test Mode"}
//             onPress={toggleTestMode}
//           />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 5,
//   },
//   error: {
//     color: 'red',
//     fontSize: 16,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 18,
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 18,
//   },
// });



























































// Test app, a simple one


// import React, { useEffect } from 'react';
// import { StyleSheet, Text, View, Button, Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       // Create a custom notification channel for Android
//       Notifications.setNotificationChannelAsync('custom-sound-channel', {
//         name: 'Custom Sound Channel',
//         importance: Notifications.AndroidImportance.HIGH,
//         sound: 'mixkit-melodical-flute-music-notification-2310.wav', // Custom sound file
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
//   }, []);

//   // Request permission for notifications
//   const requestNotificationPermission = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       const { status: newStatus } = await Notifications.requestPermissionsAsync();
//       if (newStatus !== 'granted') {
//         alert('Permission for notifications was not granted!');
//         return false;
//       }
//     }
//     return true;
//   };

//   // Trigger a notification immediately
//   const sendNotification = async () => {
//     const hasPermission = await requestNotificationPermission();
//     if (!hasPermission) return;

//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Custom Sound Notification!',
//         body: 'This notification plays a custom sound.',
//         sound: 'mixkit-melodical-flute-music-notification-2310.wav', // For iOS
//       },
//       trigger: null, // Send immediately
//       android: {
//         channelId: 'custom-sound-channel', // Use the custom channel
//       },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Custom Notification Sound</Text>
//       <Button title="Notify Me Now" onPress={sendNotification} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });





// import React, { useEffect } from 'react';
// import { StyleSheet, Text, View, Button, Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('custom-sound-channel', {
//         name: 'Custom Sound Channel',
//         importance: Notifications.AndroidImportance.HIGH,
//         sound: 'mixkit-melodical-flute-music-notification-2310.wav', // Match exact filename
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
//   }, []);

//   const requestNotificationPermission = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       const { status: newStatus } = await Notifications.requestPermissionsAsync();
//       if (newStatus !== 'granted') {
//         alert('Permission for notifications was not granted!');
//         return false;
//       }
//     }
//     return true;
//   };

//   const sendNotification = async () => {
//     const hasPermission = await requestNotificationPermission();
//     if (!hasPermission) return;

//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Custom Sound Notification!',
//         body: 'This notification plays a custom sound.',
//         sound: 'mixkit-melodical-flute-music-notification-2310.wav', // Match exact filename
//       },
//       trigger: null,
//       android: {
//         channelId: 'custom-sound-channel',
//         sound: 'mixkit-melodical-flute-music-notification-2310.wav', // Match exact filename
//       },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Custom Notification Sound</Text>
//       <Button title="Notify Me Now" onPress={sendNotification} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });





























// test for the middle notification

// import React, { useState } from 'react';
// import { StyleSheet, Text, View, Button, Platform, Animated } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import Modal from 'react-native-modal';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: false, // Don't show system alerts; we handle this with a custom modal
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [modalContent, setModalContent] = useState({ title: '', body: '' });

//   // Request permission for notifications
//   const requestNotificationPermission = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       const { status: newStatus } = await Notifications.requestPermissionsAsync();
//       if (newStatus !== 'granted') {
//         alert('Permission for notifications was not granted!');
//         return false;
//       }
//     }
//     return true;
//   };

//   // Trigger a notification
//   const sendNotification = async () => {
//     const hasPermission = await requestNotificationPermission();
//     if (!hasPermission) return;

//     const content = {
//       title: 'Aggressive Alert!',
//       body: 'This notification comes from the middle of the screen!',
//     };

//     // Display custom modal notification
//     setModalContent(content);
//     setModalVisible(true);

//     // Optional: Schedule a system notification for background
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Aggressive Alert!',
//         body: 'This notification comes from the middle of the screen!',
//         sound: 'mixkit-melodical-flute-music-notification-2310.wav', // Specify the custom sound
//       },
//       trigger: null, // Send immediately
//     });
    
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Aggressive Notifications</Text>
//       <Button title="Send Notification" onPress={sendNotification} />

//       {/* Custom Aggressive Modal */}
//       <Modal
//         isVisible={isModalVisible}
//         animationIn="slideInUp" // Animations: slideInUp, bounce, etc.
//         animationOut="slideOutDown"
//         onBackdropPress={() => setModalVisible(false)} // Close on outside touch
//       >
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>{modalContent.title}</Text>
//           <Text style={styles.modalBody}>{modalContent.body}</Text>
//           <Button title="Dismiss" onPress={() => setModalVisible(false)} />
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalBody: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });






























// Test app for scheduling time and delay tonitifcations:


// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [time, setTime] = useState(''); // Time in HH:mm format
//   const [delay, setDelay] = useState(''); // Delay in seconds

//   // Request permission for notifications
//   const requestNotificationPermission = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     if (status !== 'granted') {
//       const { status: newStatus } = await Notifications.requestPermissionsAsync();
//       if (newStatus !== 'granted') {
//         alert('Permission for notifications was not granted!');
//         return false;
//       }
//     }
//     return true;
//   };

//   // Schedule the notification
//   const scheduleNotification = async () => {
//     const hasPermission = await requestNotificationPermission();
//     if (!hasPermission) return;

//     // Validate time input
//     if (!time.match(/^\d{2}:\d{2}$/)) {
//       Alert.alert('Invalid Time', 'Please enter the time in HH:mm format.');
//       return;
//     }

//     // Parse the time and delay
//     const [hours, minutes] = time.split(':').map(Number);
//     const delaySeconds = parseInt(delay, 10);

//     if (isNaN(delaySeconds) || delaySeconds < 0) {
//       Alert.alert('Invalid Delay', 'Please enter a valid delay in seconds.');
//       return;
//     }

//     const now = new Date();
//     const notificationTime = new Date();
//     notificationTime.setHours(hours, minutes, 0, 0);
//     notificationTime.setSeconds(notificationTime.getSeconds() + delaySeconds);

//     // Check if the notification time is in the past
//     if (notificationTime <= now) {
//       Alert.alert('Invalid Time', 'The time must be in the future.');
//       return;
//     }

//     // Schedule the notification
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Scheduled Notification',
//         body: `This is your notification for ${time} with a ${delaySeconds}-second delay.`,
//       },
//       trigger: notificationTime,
//     });

//     Alert.alert('Notification Scheduled', `You will be notified at ${time} after a ${delaySeconds}-second delay.`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Schedule a Notification</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter time (HH:mm)"
//         value={time}
//         onChangeText={setTime}
//         keyboardType="numeric"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter delay in seconds"
//         value={delay}
//         onChangeText={setDelay}
//         keyboardType="numeric"
//       />
//       <Button title="Schedule Notification" onPress={scheduleNotification} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     width: '80%',
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//   },
// });




































































// First versoin, don't know if it's working or not:

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Notifications from 'expo-notifications';

// // Configure notifications to display while the app is in the foreground
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState({});
//   const [selectedPrayer, setSelectedPrayer] = useState(null);
//   const [delay, setDelay] = useState('');
//   const [delays, setDelays] = useState({}); // Store delays for all prayers
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchPrayerTimes();
//     loadDelays();
//   }, []);

//   // Fetch stored delays from AsyncStorage
//   const loadDelays = async () => {
//     try {
//       const storedDelays = await AsyncStorage.getItem('prayerDelays');
//       if (storedDelays) {
//         setDelays(JSON.parse(storedDelays));
//       }
//     } catch (err) {
//       console.error('Failed to load delays:', err);
//     }
//   };

//   // Save delays to AsyncStorage
//   const saveDelays = async (newDelays) => {
//     try {
//       await AsyncStorage.setItem('prayerDelays', JSON.stringify(newDelays));
//     } catch (err) {
//       console.error('Failed to save delays:', err);
//     }
//   };

//   // Fetch prayer times from the API
//   const fetchPrayerTimes = async () => {
//     try {
//       const response = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
//         params: {
//           city: 'Istanbul',
//           country: 'Turkey',
//           method: 13,
//         },
//       });
//       setPrayerTimes(response.data.data.timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please try again.');
//       console.error(err);
//     }
//   };

//   // Set a delay for the selected prayer
//   const setPrayerDelay = async () => {
//     if (!selectedPrayer || !delay) {
//       Alert.alert('Error', 'Please select a prayer and enter a delay.');
//       return;
//     }

//     const newDelays = { ...delays, [selectedPrayer]: parseInt(delay, 10) };
//     setDelays(newDelays);
//     await saveDelays(newDelays);

//     Alert.alert('Delay Saved', `Delay for ${selectedPrayer} set to ${delay} minutes.`);
//   };

//   // Schedule notifications for all prayers
//   const scheduleNotifications = async () => {
//     const hasPermission = await Notifications.getPermissionsAsync();
//     if (hasPermission.status !== 'granted') {
//       await Notifications.requestPermissionsAsync();
//     }

//     Object.entries(prayerTimes).forEach(async ([prayer, time]) => {
//       const prayerDelay = delays[prayer] || 0; // Use the stored delay or default to 0
//       const [hours, minutes] = time.split(':').map(Number);
//       const notificationTime = new Date();
//       notificationTime.setHours(hours, minutes, 0, 0);
//       notificationTime.setMinutes(notificationTime.getMinutes() + prayerDelay);

//       if (notificationTime > new Date()) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: `Time for ${prayer}`,
//             body: `This is your notification for ${prayer} prayer.`,
//           },
//           trigger: notificationTime,
//         });
//         console.log(`Scheduled notification for ${prayer} at ${notificationTime}`);
//       }
//     });

//     Alert.alert('Notifications Scheduled', 'Notifications have been scheduled for all prayers.');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Prayer Times</Text>
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={Object.entries(prayerTimes)}
//             keyExtractor={(item) => item[0]}
//             renderItem={({ item }) => (
//               <Text
//                 style={[
//                   styles.item,
//                   selectedPrayer === item[0] && styles.selectedItem,
//                 ]}
//                 onPress={() => setSelectedPrayer(item[0])}
//               >
//                 {item[0]}: {item[1]} (Delay: {delays[item[0]] || 0} min)
//               </Text>
//             )}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter delay in minutes"
//             value={delay}
//             onChangeText={setDelay}
//             keyboardType="numeric"
//           />
//           <Button title="Set Delay" onPress={setPrayerDelay} />
//           <Button title="Schedule Notifications" onPress={scheduleNotifications} />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 5,
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     textAlign: 'center',
//   },
//   selectedItem: {
//     backgroundColor: '#cce7ff',
//     borderColor: '#007bff',
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//   },
//   error: {
//     color: 'red',
//     fontSize: 16,
//   },
// });








































































































































































// Old school




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { Platform, StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';

// // Configure notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export default function App() {
//   const [prayerTimes, setPrayerTimes] = useState([]);
//   const [error, setError] = useState(null);
//   const [testMode, setTestMode] = useState(false);
//   const [isFirstLoad, setIsFirstLoad] = useState(true);

//   useEffect(() => {
//     setupNotifications();
//     fetchPrayerTimes();
//     setIsFirstLoad(false);
//   }, [testMode]);

//   const setupNotifications = async () => {
//     try {
//       if (!Device.isDevice) {
//         Alert.alert('Notifications not available', 'Must use physical device');
//         return;
//       }

//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync({
//           ios: {
//             allowAlert: true,
//             allowBadge: true,
//             allowSound: true,
//           },
//           android: {
//             allowAlert: true,
//             allowBadge: true,
//             allowSound: true,
//           },
//         });
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') {
//         Alert.alert(
//           'Permission Required',
//           'Please enable notifications in your device settings to receive prayer time alerts.',
//           [
//             { text: 'OK', onPress: () => console.log('Permission alert acknowledged') }
//           ]
//         );
//         return;
//       }

//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('prayer-times', {
//           name: 'Prayer Times',
//           description: 'Notifications for prayer times',
//           importance: Notifications.AndroidImportance.HIGH,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//           enableVibrate: true,
//           enableLights: true,
//           sound: true,
//         });

//         await Notifications.setNotificationChannelAsync('test-channel', {
//           name: 'Test Notifications',
//           description: 'Test notification channel',
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: '#FF231F7C',
//           enableVibrate: true,
//           enableLights: true,
//           sound: true,
//         });
//       }
//     } catch (error) {
//       console.error('Error setting up notifications:', error);
//       Alert.alert('Setup Error', 'Failed to setup notifications');
//     }
//   };

//   const fetchPrayerTimes = async () => {
//     try {
//       let timings;
//       if (testMode) {
//         timings = {
//           Fajr: '03:32',
//           Dhuhr: '23:56',
//           Asr: '23:57',
//           Maghrib: '17:56',
//           Isha: '19:42',
//         };
//       } else {
//         const response = await axios.get(
//           'https://api.aladhan.com/v1/timings',
//           {
//             params: {
//               latitude: 41.021988,
//               longitude: 28.660188,
//               method: 13,
//             },
//           }
//         );
//         timings = response.data.data.timings;
//       }

//       setPrayerTimes(timings);

//       // Only send test notification on first load when test mode is enabled
//       if (testMode && isFirstLoad) {
//         try {
//           await Notifications.scheduleNotificationAsync({
//             content: {
//               title: 'Test Mode Active',
//               body: 'Prayer time notifications will use test times.',
//               sound: true,
//               priority: Notifications.AndroidImportance.HIGH,
//               channelId: 'test-channel',
//             },
//             trigger: { 
//               seconds: 5,
//               channelId: 'test-channel',
//             },
//           });
//           console.log('Test notification scheduled successfully');
//         } catch (error) {
//           console.error('Error scheduling test notification:', error);
//         }
//       }

//       scheduleNotifications(timings);
//     } catch (err) {
//       setError('Failed to fetch prayer times. Please check your connection.');
//       console.error(err);
//     }
//   };

//   const scheduleNotifications = async (timings) => {
//     try {
//       // Fix prayer name typo and include all prayers
//       const offsets = {
//         Fajr: 1,
//         Dhuhr: 1,  // Fixed spelling from Dhur to Dhuhr
//         Asr: 1,
//         Maghrib: 1,
//         Isha: 1,
//       };

//       // Cancel existing notifications before scheduling new ones
//       await Notifications.cancelAllScheduledNotificationsAsync();

//       for (const [prayer, time] of Object.entries(timings)) {
//         // Check if this prayer should have notifications
//         if (prayer in offsets) {  // Changed condition to check if prayer exists in offsets
//           const [hour, minute] = time.split(':').map(Number);
//           const notificationDate = new Date();
//           const totalMinutes = minute + offsets[prayer];
//           notificationDate.setHours(hour + Math.floor(totalMinutes / 60), totalMinutes % 60, 0);

//           // If the time has already passed today, schedule for tomorrow
//           if (notificationDate <= new Date()) {
//             notificationDate.setDate(notificationDate.getDate() + 1);
//           }

//           await Notifications.scheduleNotificationAsync({
//             content: {
//               title: `${prayer} Prayer Time`,
//               body: `It's time for ${prayer} prayer.`,
//               sound: true,
//               priority: Notifications.AndroidImportance.HIGH,
//               channelId: 'prayer-times',
//             },
//             trigger: {
//               date: notificationDate,
//               channelId: 'prayer-times',
//             },
//           });
//           console.log(`Scheduled ${prayer} notification for ${notificationDate}`);
//         }
//       }
//     } catch (error) {
//       console.error('Error scheduling notifications:', error);
//       Alert.alert('Schedule Error', 'Failed to schedule prayer time notifications');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Prayer Times {testMode ? '(Test Mode)' : ''}</Text>
//       <Button
//         title={testMode ? 'Disable Test Mode' : 'Enable Test Mode'}
//         onPress={() => setTestMode(!testMode)}
//       />
//       {error ? (
//         <Text style={styles.error}>{error}</Text>
//       ) : (
//         <FlatList
//           data={Object.entries(prayerTimes)}
//           keyExtractor={(item) => item[0]}
//           renderItem={({ item }) => (
//             <Text style={styles.item}>
//               {item[0]}: {item[1]}
//             </Text>
//           )}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   item: {
//     fontSize: 18,
//     marginVertical: 5,
//   },
//   error: {
//     color: 'red',
//     fontSize: 16,
//   },
// });