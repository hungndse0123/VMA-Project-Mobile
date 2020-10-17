import React from 'react';
import {StyleSheet} from 'react-native';
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';

const Forgot = () => {
  return (
    <Block center middle>
      <Text>Forgot</Text>
    </Block>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  Forgot: {
    flex: 1,
  },
});
