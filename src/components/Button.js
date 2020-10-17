import React from 'react';
import {StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import * as theme from '../constants/theme';

const {width} = Dimensions.get('window');

const Button = ({children, opacity, full, style, ...props}) => {
  const buttonStyles = [styles.button, full && styles.full, style];
  return (
    <TouchableOpacity
      style={buttonStyles}
      activeOpacity={opacity || 0.8}
      {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.blue,
    borderRadius: 5,
    height: 55,
    // paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  full: {
    width: width - 50,
  },
});
