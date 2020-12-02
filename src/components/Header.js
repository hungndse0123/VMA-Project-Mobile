
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";

import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/EvilIcons";
import { HeaderBackButton } from '@react-navigation/stack';


export default function Header({ navigation, title }) {
  let isRootScreen = (title) => title === "Service";

  return (
    <View style={styles.header}>
      <View style={styles.left} >
        {isRootScreen(title) ?
          (<TouchableOpacity onPress={() => {
            navigation.openDrawer()
          }}>
            <Icon
              name="list" color="black" size={23}
              style={{ paddingLeft: 10 }}
            />
          </TouchableOpacity>) : (<HeaderBackButton onPress={() => navigation.goBack(null)} />)}
      </View>
      <View style={styles.center} >
        <Text style={styles.text}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => {

      }}>
        <Icon2 name="bell" color="black" size={30} style={styles.right, { padding: 5 }} />
      </TouchableOpacity>

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