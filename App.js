import React, { useState, useEffect } from 'react'; // Use React Hooks:
// useState to store prayer times.
// useEffect to fetch data when the app loads.

import axios from 'axios'; // Import Axios

import { StyleSheet, Text, View, FlatList } from 'react-native';


//Fetch prayer times when the app loads
export default function App() {
  const [prayerTimes, setPrayerTimes] = useState([]); // State to store prayer times
  const [error, setError] = useState(null); // State to handle errors

  // Fetch prayer times when the app loads
  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const response = await axios.get(
        'https://api.aladhan.com/v1/timingsByCity',
        {
          params: {
            city: '41.021988',
            country: '28.660188',
            // latitude: '41.021988',
            // longitude: '28.660188',
            // city: 'istanbul',
            // country: 'turkey',

            method: 13, // Calculation method (adjust as needed)
          },
        }
      );
      setPrayerTimes(response.data.data.timings); // Save the prayer times
    } catch (err) {
      setError('Failed to fetch prayer times. Please try again.'); // Handle errors
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Times</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text> // Show error message
      ) : (
        <FlatList
          data={Object.entries(prayerTimes)} // Convert prayer times object to array
          keyExtractor={(item) => item[0]} // Use the prayer name as the key
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item[0]}: {item[1]} {/* Render prayer name and time */}
            </Text>
          )}
        />
      )}
    </View>
  );
}

// Define styles outside the component
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
