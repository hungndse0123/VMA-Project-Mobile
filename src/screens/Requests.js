import React, { useState, useEffect } from "react";
import axios from 'axios';

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, Modal, View, TouchableHighlight, Picker, FlatList } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Label from '../components/Label';
import menu from '../assets/images/icons/menu.png';
import * as theme from '../constants/theme';
import Auth from "@react-native-firebase/auth";
import DropDownPicker from 'react-native-dropdown-picker';
import { Left } from "native-base";
import Header from "../components/Header";

const ProfileScreen = ({ navigation, route }) => {
  const styles = StyleSheet.create({
    overview: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.gray2,
    },
    margin: {
      marginHorizontal: 25,
    },
    marginButton: {
      height: 35,
      width: 135,
      marginTop: 15,
      marginRight: 10
    },
    marginCard: {
      height: 60,
      marginTop: 3,
    },
    driver: {
      marginBottom: 11,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    button: {
      justifyContent: "center",
      width: 200,
      alignSelf: "center",
      marginBottom: 20,
    },
    card: {
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
      backgroundColor: theme.colors.white,
    },
    inactive: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 5,
    },
    active: {
      borderColor: theme.colors.blue,
      shadowOffset: { width: 0, height: 0 },
      shadowColor: theme.colors.lightblue,
      shadowRadius: 3,
      shadowOpacity: 1,
    },
    icon: {
      flex: 0,
      height: 48,
      width: 48,
      borderRadius: 48,
      marginBottom: 5,
      backgroundColor: theme.colors.lightblue
    },
    check: {
      position: 'absolute',
      right: -9,
      top: -9,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      marginTop: 22,

    },
    modalView: {
      backgroundColor: "white",
      padding: 115,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    label: {
      textTransform: 'uppercase',
      marginBottom: 8
    },
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        setUser(null);
        console.log(error);
      });
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Document update");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  let Image_Http_URL = { uri: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/80742826_2481110258768067_7881332290297528320_o.jpg?_nc_cat=104&ccb=2&_nc_sid=09cbfe&_nc_ohc=xABpuTzKeNkAX9UlkVS&_nc_ht=scontent.fsgn2-5.fna&oh=ba9257d410d63d4dd10fc28bf9d9bfb6&oe=5FBF8173" };
  return (
    <SafeAreaView style={styles.overview}>
      <Header navigation={navigation} title="Profile" />
      <ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          {/* <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View> */}
          <View style={styles.centeredView}>
            <Card style={styles.margin, { marginHorizontal: 10, marginTop: 70, marginBottom: 10 }} title="Filter options">
              <Text caption medium style={styles.label}>
                Request type
          </Text>
              <DropDownPicker
                items={[
                  { label: 'Vehicle change', value: 'Vehicle change' },
                  { label: 'Document update', value: 'Document update' },
                ]}
                defaultValue={selectedType}
                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                placeholder="Select type"
                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                onChangeItem={item => setSelectedType(item.value)}
              />
              <Input
                full
                label="From"
                style={{ marginBottom: 25, width: 250 }}
              />
              <Input
                full
                label="To"
                style={{ marginBottom: 25, width: 250 }}
              />
              <Text caption medium style={styles.label}>
                Request status
          </Text>
              <DropDownPicker
                items={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Solved', value: 'Solved' },
                ]}
                defaultValue={selectedStatus}
                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                placeholder="Select type"
                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                onChangeItem={item => setSelectedStatus(item.value)}
              />
              <Button center style={styles.margin} onPress={() => {
                setModalVisible(!modalVisible);
              }}>
                <Text color="white">
                  Filter
            </Text>
              </Button>
            </Card>
          </View>
        </Modal>
        <Card column middle>
          <Block flex={1.2} row style={{ marginRight: 20 }}>
            <Image source={Image_Http_URL} style={{ height: 50, width: 50, borderRadius: 400 / 2 }} />
            <Block>
              <Text style={{ paddingHorizontal: 16, marginTop: 3 }}>Nguyen Duc Hung</Text>
              <Text ligth caption style={{ paddingHorizontal: 16, marginTop: 3 }}>Driver</Text>
            </Block>

          </Block>
          <Block row>
            <Button style={styles.marginButton}>
              <Text color="white">
                Create request
            </Text>
            </Button>
            <Button style={styles.marginButton} onPress={() => {
              setModalVisible(true);
            }}>
              <Text color="white">
                Filter
            </Text>
            </Button>
          </Block>
        </Card>
        {/* <Block row style={[styles.margin, { marginTop: 30 }]}>
        <Text caption medium style={[styles.label, { marginLeft: 5 }]}>
                ID
          </Text>
          <Text caption medium style={[styles.label, { marginLeft: 35 }]}>
                Subject
          </Text>
          <Text caption medium style={[styles.label, { marginLeft: 50 }]}>
                Status
          </Text>
        </Block> */}
        <Card row style={[styles.marginCard], { backgroundColor: theme.colors.gray2, height: 12 }} border="false" shadow="false">
          <Block>
            <Text medium caption style={[styles.label]}>
              ID
        </Text>
          </Block>
          <Block>
            <Text medium caption style={[styles.label, { width: 90 }]}>
              Type
        </Text>
          </Block>
          <Block >
            <Text medium caption style={[styles.label, { marginLeft: 14 }]}>
              Status
        </Text>
          </Block>
          <Block>
            <Text style={[{ marginLeft: 33 }]}>
            </Text>
          </Block>
        </Card>
        <FlatList
          data={[
            {
              ID: '#2178',
              requestType: 'License update',
              status: 'Pending'
            },
            {
              ID: '#2178',
              requestType: 'License update',
              status: 'Pending'
            },
            {
              ID: '#2178',
              requestType: 'Document update',
              status: 'Solved'
            },
            {
              ID: '#2178',
              requestType: 'License update',
              status: 'Pending'
            },
            {
              ID: '#2178',
              requestType: 'License update',
              status: 'Pending'
            },
            {
              ID: '#2178',
              requestType: 'License update',
              status: 'Pending'
            },
          ]}
          renderItem={({ item }) =>
            <Card center row style={[styles.marginCard]}>
              <Block>
                <Text medium>
                  {item.ID}
                </Text>
              </Block>
              <Block>
                <Text medium style={{ width: 90 }}>
                  {item.requestType}
                </Text>
              </Block>
              <Block >
                <Text medium style={[{ marginLeft: 14 }]}>
                  {item.status}
                </Text>
              </Block>
              <Block>
                <Text onPress={() => navigation.navigate("Service")} style={[{ marginLeft: 33, color: 'blue' }]}>
                  View
          </Text>
              </Block>
            </Card>}
        />
      </ScrollView>

    </SafeAreaView>
  );
};

export default ProfileScreen;
