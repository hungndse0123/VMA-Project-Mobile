import React from 'react';
import {StyleSheet, TextInput, View, Dimensions} from 'react-native';
import Text from './Text';
import * as theme from '../constants/theme';

const {width} = Dimensions.get('window');

const Input = ({
  label,
  rightLabel,
  style,
  email,
  phone,
  number,
  full,
  password,
  marginBottom,
  ...props
}) => {
  const inputStyles = [
    styles.input,
    marginBottom && {marginBottom: marginBottom},
    full && styles.full,
    style,
  ];

  const inputType = email
    ? 'email-address'
    : number
    ? 'numeric'
    : phone
    ? 'phone-pad'
    : 'default';

  return (
    <View>
      <View style={styles.labelContainer}>
        <Text
          // height={14}
          // weight={'bold'}

          // size={12}
          // spacing={1.12}
          // color="#B0BAC9"
          style={styles.label}
          caption
          medium>
          {label}
        </Text>
        {rightLabel}
      </View>
      <TextInput
        style={inputStyles}
        secureTextEntry={password}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={inputType}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.input,
    // opacity: 0.2,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: 5,
    fontSize: theme.sizes.font,
    color: theme.colors.black,
    height: 45,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  label: {
    textTransform: 'uppercase',
  },

  full: {
    width: width - 50,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
