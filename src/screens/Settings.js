import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Settings = () => {
  return (
    <View style={styles.settings}>
      <Text>Settings Screen</Text>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  settings: {
    flex: 1,
  },
});
