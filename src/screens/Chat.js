import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Chat = () => {
  return (
    <View style={styles.chat}>
      <Text>Chat</Text>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  chat: {
    flex: 1,
  },
});
