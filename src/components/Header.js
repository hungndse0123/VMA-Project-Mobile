// import React from 'react';
// import { Text, View } from 'react-native';

// const Header = () => {

//   return <Text>App Header</Text>;
// };

// //export component để dùng ở 1 nơi khác
// module.exports = Header;
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";


export default function Header({ navigation, title }) {
  return (
    <View style={styles.header}>
      <View style={styles.left} >
        <TouchableOpacity onPress={() => {
          navigation.openDrawer()
        }}>
          <Icon
            name="list" color="black" size={23}
            style={{ paddingLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.center} >
        <Text style={styles.text}>{title}</Text>
      </View>
      <View style={styles.right} >
        <Icon name="dots-three-vertical" color="black" size={23} style={{ padding: 5 }} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cecece'
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18
  }
})