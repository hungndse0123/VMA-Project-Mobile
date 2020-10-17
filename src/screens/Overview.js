import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Overview = () => {
  return (
    <View style={styles.overview}>
      <Text>Overview</Text>
    </View>
  );
};

export default Overview;

const styles = StyleSheet.create({
  overview: {
    flex: 1,
  },
});
