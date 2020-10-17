import React from 'react';
import {StyleSheet, View} from 'react-native';

const Block = ({
  children,
  flex,
  row,
  center,
  middle,
  space,
  style,
  ...props
}) => {
  const blockStyles = [
    styles.block,
    flex && {flex},
    center && styles.center,
    middle && styles.middle,
    space && {justifyContent: `space-${space}`},
    row && styles.row,
    style,
  ];
  return (
    <View style={blockStyles} {...props}>
      {children}
    </View>
  );
};

export default Block;

const styles = StyleSheet.create({
  block: {flex: 1},
  center: {alignItems: 'center'},
  middle: {justifyContent: 'center'},
  row: {flexDirection: 'row'},
});
