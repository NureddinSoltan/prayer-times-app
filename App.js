import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [error, setError] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    setupNotifications();
    fetchPrayerTimes();
    setIsFirstLoad(false);
  }, [testMode]);

  const setupNotifications = async () => {
    try {
      if (!Device.isDevice) {
        Alert.alert('Notifications not available', 'Must use physical device');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
          android: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive prayer time alerts.',
          [
            { text: 'OK', onPress: () => console.log('Permission alert acknowledged') }
          ]
        );
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('prayer-times', {
          name: 'Prayer Times',
          description: 'Notifications for prayer times',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableVibrate: true,
          enableLights: true,
          sound: true,
        });

        await Notifications.setNotificationChannelAsync('test-channel', {
          name: 'Test Notifications',
          description: 'Test notification channel',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableVibrate: true,
          enableLights: true,
          sound: true,
        });
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
      Alert.alert('Setup Error', 'Failed to setup notifications');
    }
  };

  const fetchPrayerTimes = async () => {
    try {
      let timings;
      if (testMode) {
        timings = {
          Fajr: '03:32',
          Dhuhr: '23:56',
          Asr: '23:57',
          Maghrib: '17:56',
          Isha: '19:42',
        };
      } else {
        const response = await axios.get(
          'https://api.aladhan.com/v1/timings',
          {
            params: {
              latitude: 41.021988,
              longitude: 28.660188,
              method: 13,
            },
          }
        );
        timings = response.data.data.timings;
      }

      setPrayerTimes(timings);

      // Only send test notification on first load when test mode is enabled
      if (testMode && isFirstLoad) {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Test Mode Active',
              body: 'Prayer time notifications will use test times.',
              sound: true,
              priority: Notifications.AndroidImportance.HIGH,
              channelId: 'test-channel',
            },
            trigger: { 
              seconds: 5,
              channelId: 'test-channel',
            },
          });
          console.log('Test notification scheduled successfully');
        } catch (error) {
          console.error('Error scheduling test notification:', error);
        }
      }

      scheduleNotifications(timings);
    } catch (err) {
      setError('Failed to fetch prayer times. Please check your connection.');
      console.error(err);
    }
  };

  const scheduleNotifications = async (timings) => {
    try {
      // Fix prayer name typo and include all prayers
      const offsets = {
        Fajr: 1,
        Dhuhr: 1,  // Fixed spelling from Dhur to Dhuhr
        Asr: 1,
        Maghrib: 1,
        Isha: 1,
      };

      // Cancel existing notifications before scheduling new ones
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const [prayer, time] of Object.entries(timings)) {
        // Check if this prayer should have notifications
        if (prayer in offsets) {  // Changed condition to check if prayer exists in offsets
          const [hour, minute] = time.split(':').map(Number);
          const notificationDate = new Date();
          const totalMinutes = minute + offsets[prayer];
          notificationDate.setHours(hour + Math.floor(totalMinutes / 60), totalMinutes % 60, 0);

          // If the time has already passed today, schedule for tomorrow
          if (notificationDate <= new Date()) {
            notificationDate.setDate(notificationDate.getDate() + 1);
          }

          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer} Prayer Time`,
              body: `It's time for ${prayer} prayer.`,
              sound: true,
              priority: Notifications.AndroidImportance.HIGH,
              channelId: 'prayer-times',
            },
            trigger: {
              date: notificationDate,
              channelId: 'prayer-times',
            },
          });
          console.log(`Scheduled ${prayer} notification for ${notificationDate}`);
        }
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      Alert.alert('Schedule Error', 'Failed to schedule prayer time notifications');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Times {testMode ? '(Test Mode)' : ''}</Text>
      <Button
        title={testMode ? 'Disable Test Mode' : 'Enable Test Mode'}
        onPress={() => setTestMode(!testMode)}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={Object.entries(prayerTimes)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item[0]}: {item[1]}
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    marginVertical: 5,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});