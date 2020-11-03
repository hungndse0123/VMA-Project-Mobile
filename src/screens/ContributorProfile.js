import React, { useState, useEffect } from "react";
import axios from 'axios';
import ContributorRepository from '../repositories/ContributorRepository';
import UserRepository from '../repositories/UserRepository';

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, AsyncStorage } from "react-native";
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

    const _storeData = () => {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => alert('success'));
    };

    const signOut = () => {
        signOutUser()
            .then(() => {
                updateStatus(user.uid);
                _storeData();
                BackHandler.exitApp();
            })
            .catch((error) => {
                alert(error);
            });
    };
    const updateStatus = (userid) => {
        UserRepository.updateUserStatusByUserId(userid, 'INACTIVE')

    }

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

    // const [driverdetailname, setDriverdetailname] = useState('');
    //const [driverdetailphone, setDriverdetailphone] = useState('');
    // const [driverdetailbirthdate, setDriverdetailbirthdate] = useState('');
    // const [driverdetailaddress, setDriverdetailaddress] = useState('');
    // const [driverdetailimage, setDriverdetailimage] = useState('');
    const [contributor, setContributor] = useState(null);
    //let Image_Http_URL = { uri: contributor.imageLink };
    const init = userid => {
        ContributorRepository.getDetailContributor(userid)
            .then((response) => {
                const result = Object.entries(response);

                setContributor({
                    ...contributor,
                    result
                })
                console.log(contributor);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Profile" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Personal profile">
                    <Block column center style={{ marginTop: 10 }}>
                        {/* <Image source={Image_Http_URL} style={{ height: 100, width: 100, marginBottom: 25 }} center /> */}
                        <Input
                            full
                            email
                            label="Phone number"
                            // value={}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            email
                            label="Full name"
                            // value={contributor.fullName}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            email
                            label="Birthdate"
                            // value={contributor.dateOfBirth}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            email
                            label="Address"
                            // value={contributor.address}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Button full style={styles.margin} onPress={signOut}>
                            <Text color="white">
                                Sign out
            </Text>
                        </Button>
                    </Block>


                </Card>
            </ScrollView>

        </SafeAreaView>
    );
};

export default ProfileScreen;
