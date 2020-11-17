import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import ContributorRepository from '../repositories/ContributorRepository';
import UserRepository from '../repositories/UserRepository';
import DriverRepository from '../repositories/DriverRepository';
import VehicleRepository from '../repositories/VehicleRepository';

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, FlatList, AsyncStorage } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Label from '../components/Label';
import menu from '../assets/images/icons/menu.png';
import * as theme from '../constants/theme';
import Auth from "@react-native-firebase/auth";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/Entypo";

const VehicleDetail = ({ navigation, route }) => {
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
    const [documentVisible, setDocumentVisible] = useState(false);
    const { itemId } = route.params;
    const isFocused = useIsFocused();
    const [vehicleType, setVehicleType] = useState('');
    const [brandName, setBrandName] = useState('');
    const [driverName, setDriverName] = useState('');


    useEffect(() => {

        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                init();
                //console.log(Profile_Image);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });

    }, [isFocused]);

    const _storeData = () => {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => alert('success'));
    };
    const [vehicle, setVehicle] = useState({})
    const init = () => {
        VehicleRepository.getDetailVehicle(itemId)
            .then((response) => {
                //console.log(response);
                const result = Object.entries(response);
                //console.log(response["userId"]);
                //console.log(result["userId"]);
                // setDriver({
                //     ...driver,
                //     result
                // })
                setVehicle(response);
                setVehicleType(response["vehicleType"]["vehicleTypeName"])
                setBrandName(response["brand"]["brandName"])
                setDriverName(response["assignedDriver"]["userName"])
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //const [contributor, setContributor] = useState(null);


    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Vehicle detail" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
                {vehicle !== {} ? (
                    <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Vehicle detail">
                        <Block column center style={{ marginTop: 10 }}>
                            <Image source={{ uri: vehicle["imageLink"] }} style={{ height: 250, width: 250, marginBottom: 25 }} center />
                            <Input
                                full
                                label="Vehicle number"
                                value={vehicle["vehicleId"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Vehicle Type"
                                value={vehicleType}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Brand"
                                value={brandName}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Status"
                                value={vehicle["vehicleStatus"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Seats"
                                value={JSON.stringify(vehicle["seats"])}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Model"
                                value={vehicle["model"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Origin"
                                value={vehicle["origin"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Chassis Number"
                                value={vehicle["chassisNumber"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Engine Number"
                                value={vehicle["engineNumber"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Manufacture Year"
                                value={vehicle["yearOfManufacture"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Registration Date"
                                value={vehicle["dateOfRegistration"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Distance Driven"
                                value={JSON.stringify(vehicle["distanceDriven"])}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Assigned to driver"
                                value={driverName}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                        </Block>


                    </Card>
                ) : (<></>)}
            </ScrollView>

        </SafeAreaView>
    );
};

export default VehicleDetail;
