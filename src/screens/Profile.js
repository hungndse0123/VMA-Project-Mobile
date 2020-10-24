import React, { useState, useEffect } from "react";
import axios from 'axios';

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback  } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Label from '../components/Label';
import Header from '../components/Header';
import {GetData} from '../services/Api';
import menu from '../assets/images/icons/menu.png';
import * as theme from '../constants/theme';
import Auth from "@react-native-firebase/auth";

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
    }
});

const [user, setUser] = useState(null);

    useEffect(() => {
      getCurrentUser()
          .then((user) => {
              setUser(user);
              // init(user.uid);
              init(user.uid);
          })
          .catch((error) => {
              setUser(null);
              console.log(error);
          });
  }, []);

    const profileIcon = (
        <Image
            source={require('../assets/images/icons/profile.png')}
            style={{ height: 60, width: 60 }}
        />
    );
    const requestIcon = (
        <Image
            source={require('../assets/images/icons/request.png')}
            style={{ height: 60, width: 60 }}
        />
    );

    const maintenanceIcon = (
        <Image
            source={require('../assets/images/icons/maintenance.png')}
            style={{ height: 60, width: 60 }}
        />
    );
//   const [user, setUser] = useState(null);

  const [driverdetailname, setDriverdetailname] = useState('');
  const [driverdetailphone, setDriverdetailphone] = useState('');
  const [driverdetailbirthdate, setDriverdetailbirthdate] = useState('');
  const [driverdetailaddress, setDriverdetailaddress] = useState('');
  const [driverdetailimage, setDriverdetailimage] = useState('');
  let Image_Http_URL ={ uri: driverdetailimage};
    // userId: '',
    // fullName: '',
    // phoneNumber: '',
    // userStatus: { userStatusId: '', userStatusName: '' },
    // dateOfBirth: '',
    // address: '',
    // imageLink: '',
    // baseSalary: 0,
  

//   const signOut = () => {
//     signOutUser()
//       .then(() => {
//         alert("User Signed out");
//         BackHandler.exitApp();
//       })
//       .catch((error) => {
//         alert(error);
//       });
//   };

  // const init = (userid) => {
  //   // GetData("drivers?phoneNumber=0769969167")
  //   //   .then((response) => {
  //   //     setTestdata(response);
  //   //     console.log(response)
  //   //   })
  //   //   .catch((error) => {
  //   //     alert(error);
  //   //   });
  //   //console.log(`${'http://192.168.1.3:9000/api/v1/drivers/'}${userid}`);
  // axios.get('http://192.168.1.3:9000/api/v1/drivers/941287851231')
  // .then(function (response) {
  //   // handle success
  //   //console.log(response.data.driverDetail.address);
  //   setDriverdetailname({
  //     userId: `${response.data.driverDetail.userId}`,
  //     fullName: `${response.data.driverDetail.fullName}`,
  //     phoneNumber: `${response.data.driverDetail.phoneNumber}`,
  //     // userStatus: { userStatusId: '', userStatusName: '' },
  //     dateOfBirth:`${response.data.driverDetail.dateOfBirth}`,
  //     address: `${response.data.driverDetail.address}`,
  //     imageLink: `${response.data.driverDetail.imageLink}`,
  //     baseSalary:`${response.data.driverDetail.baseSalary}`,
  //   })
  //   console.log(driverdetailname.fullName+"hung")
  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(error);
  // })
  // };
  const init = userid => {
    axios({
      "method": "GET",
      "url": "http://192.168.1.3:9000/api/v1/drivers/"+userid,
    })
      .then((response) => {
        setDriverdetailname(response.data.driverDetail.fullName);
        setDriverdetailphone(response.data.driverDetail.phoneNumber);
        setDriverdetailbirthdate(response.data.driverDetail.dateOfBirth);
        setDriverdetailaddress(response.data.driverDetail.address);
        setDriverdetailimage(response.data.driverDetail.imageLink);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <SafeAreaView style={styles.overview}>
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
                
                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Personal profile">
                    <Block column center style={{marginTop: 10 }}>
                      <Image source={Image_Http_URL} style={{ height: 100, width: 100, marginBottom: 25}} center/>
                    <Input
                full
                email
                label="Phone number"
                value={driverdetailphone}
                style={{ marginBottom: 25 }}
                editable = {false}
              />
              <Input
                full
                email
                label="Full name"
                value={driverdetailname}
                style={{ marginBottom: 25 }}
                editable = {false}
              />
              <Input
                full
                email
                label="Birthdate"
                value={driverdetailbirthdate}
                style={{ marginBottom: 25 }}
                editable = {false}
              />
              <Input
                full
                email
                label="Address"
                value={driverdetailaddress}
                style={{ marginBottom: 25 }}
                editable = {false}
              />
              <Button full style={styles.margin} onPress={() => navigation.navigate("Service")}>
                    <Text color="white">
                        Back to Service page
            </Text>
                </Button>
                    </Block>


                </Card>
            </ScrollView>

        </SafeAreaView>
  );
};

export default ProfileScreen;
