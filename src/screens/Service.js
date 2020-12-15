import React, { useState, useEffect } from "react";
import axios from 'axios';
import UserRepository from '../repositories/UserRepository';

import { Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import * as theme from '../constants/theme';
import Header from "../components/Header";
import Geolocation from '@react-native-community/geolocation';

const ProfileScreen = ({ navigation }) => {
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

    const signOut = () => {
        signOutUser()
            .then(() => {
                //updateStatus(user.uid);
                BackHandler.exitApp();
            })
            .catch((error) => {
                alert(error["debugMessage"]);
            });
    };
    // const updateStatus = (userid) => {
    //     axios({
    //         method: 'PATCH',
    //         url: "http://192.168.43.125:9000/api/v1/users/" + userid + "?userStatusId=2",
    //         //   url: "http://192.168.1.3:9000/api/v1/users/941287851231?userStatusId=2",
    //         params: {

    //         }
    //     }).then((response) => {
    //     })
    //         .catch((error) => {
    //             console.log(error)
    //         });

    // }

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                Geolocation.getCurrentPosition(info => console.log(info));
                setUser(user);
                updateStatus(user.uid)
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });
    }, []);
    const updateStatus = (userid) => {
        UserRepository.updateUserStatusByUserId(userid, 'ACTIVE')
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
    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Service" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
                {/* <Text caption center onPress={signOut}>
                    Log out
            </Text> */}
                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 30, }} title="Service">
                    <Block row style={{ marginHorizontal: 2, marginTop: 10, }}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("Profile")}
                            style={styles.activeBorder}
                        >
                            <Block
                                style={[
                                    styles.card,
                                    styles.active
                                ]}
                            >
                                <Block row>
                                    <Block style={styles.icon}>
                                        {profileIcon}
                                    </Block>
                                    <Block style={{ marginLeft: 17, marginTop: 10 }}>
                                        <Text h4 style={{ marginBottom: 5, marginLeft: 10 }} >View Profile</Text>
                                        <Text style={{ marginLeft: 10 }} color="black3">View personal info</Text>
                                    </Block>
                                </Block>
                            </Block>
                        </TouchableWithoutFeedback>
                    </Block>
                    <Block row style={{ marginHorizontal: 2, marginTop: 10, }}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("Requests")}
                            style={styles.activeBorder}
                        >
                            <Block
                                style={[
                                    styles.card,
                                    styles.active
                                ]}
                            >
                                <Block row>
                                    <Block style={styles.icon}>
                                        {requestIcon}
                                    </Block>
                                    <Block style={{ marginLeft: 17, marginTop: 10 }}>
                                        <Text h4 style={{ marginBottom: 5, marginLeft: 10 }} >View Request</Text>
                                        <Text style={{ marginLeft: 10 }} color="black3">View list request</Text>
                                    </Block>
                                </Block>
                            </Block>
                        </TouchableWithoutFeedback>
                    </Block>
                    <Block row style={{ marginHorizontal: 2, marginTop: 10, }}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("Trips", {
                                lastRefresh: Date(Date.now()).toString(),
                            })}
                            style={styles.activeBorder}
                        >
                            <Block
                                style={[
                                    styles.card,
                                    styles.active
                                ]}
                            >
                                <Block row>
                                    <Block style={styles.icon}>
                                        {maintenanceIcon}
                                    </Block>
                                    <Block style={{ marginLeft: 17, marginTop: 10 }}>
                                        <Text h4 style={{ marginBottom: 5, marginLeft: 10 }} >Trips</Text>
                                        <Text style={{ marginLeft: 10 }} color="black3">View Trips</Text>
                                    </Block>
                                </Block>
                            </Block>
                        </TouchableWithoutFeedback>
                    </Block>
                    <Block row style={{ marginHorizontal: 2, marginTop: 10, }}>
                        <TouchableWithoutFeedback
                            onPress={() => navigation.navigate("AssignedVehicle")}
                            style={styles.activeBorder}
                        >
                            <Block
                                style={[
                                    styles.card,
                                    styles.active
                                ]}
                            >
                                <Block row>
                                    <Block style={styles.icon}>
                                        {maintenanceIcon}
                                    </Block>
                                    <Block style={{ marginLeft: 17, marginTop: 10 }}>
                                        <Text h4 style={{ marginBottom: 5, marginLeft: 10 }} >Assigned Vehicle</Text>
                                        <Text style={{ marginLeft: 10 }} color="black3">View Assigned Vehicle info</Text>
                                    </Block>
                                </Block>
                            </Block>
                        </TouchableWithoutFeedback>
                    </Block>
                </Card>
            </ScrollView>

        </SafeAreaView>

    );
};

export default ProfileScreen;