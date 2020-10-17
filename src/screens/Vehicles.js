import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Vehicles = () => {
  return (
    <View style={styles.vehicles}>
      <Text>Vehicles </Text>
    </View>
  );
};

export default Vehicles;

const styles = StyleSheet.create({
  vehicles: {
    flex: 1,
  },
});
