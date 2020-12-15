import React, { useState, useEffect } from "react";
import axios from 'axios';
import UserRepository from '../repositories/UserRepository';

import { Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import * as theme from '../constants/theme';
import Header from "../components/Header";



const RepairContact = ({ navigation }) => {
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
    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Repair Contact" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
                {/* <Text caption center onPress={signOut}>
                    Log out
            </Text> */}
                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 30, }} title="Repair Contact">
                    <Block
                        style={[
                            styles.card,
                            styles.active,
                            { marginBottom: 15 }
                        ]}
                    >
                        <Block row >
                            <Text h4 style={{ marginBottom: 15 }} color="brown">Admin Contact  </Text>
                        </Block>
                        <Block row>
                            <Block column>

                                <Text style={{ marginLeft: 10 }} color="black3">Full Name: Ly Phuoc Hiep</Text>
                                <Text style={{ marginLeft: 10 }} color="black3">Phone Number: 0335452591</Text>

                            </Block>
                        </Block>
                    </Block>
                    {/* <Block row style={{ marginHorizontal: 2, marginTop: 10, }}>
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
                                        {maintenanceIcon}
                                    </Block>
                                    <Block style={{ marginLeft: 17, marginTop: 10 }}>
                                        <Text h4 style={{ marginBottom: 5, marginLeft: 10 }} >Maintenance</Text>
                                        <Text style={{ marginLeft: 10 }} color="black3">Maintenance report</Text>
                                    </Block>
                                </Block>
                            </Block>
                        </TouchableWithoutFeedback>
                    </Block> */}
                </Card>
            </ScrollView>

        </SafeAreaView>
    );
};

export default RepairContact;