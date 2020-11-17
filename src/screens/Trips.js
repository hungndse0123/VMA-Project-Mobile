import React, { useState, useEffect } from "react";
import axios from 'axios';
import Repository from "../repositories/Repository";
import ContractRepository from "../repositories/ContractRepository";
import VehicleRepository from "../repositories/VehicleRepository";

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, Modal, View, TouchableHighlight, Picker, FlatList, Dimensions } from "react-native";
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
import Header from "../components/Header";
import Loader from '../components/Loader';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width } = Dimensions.get("window");

const TripsScreen = ({ navigation, route }) => {
    const styles = StyleSheet.create({
        overview: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.gray2,
        },
        margin: {
            marginHorizontal: 10,
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
    const [isLoading, setIsLoading] = useState(false);
    const [issuedvehicleid, setIssuedvehicleid] = useState('');

    useEffect(() => {

        getCurrentUser()
            .then((user) => {
                setUser(user);
                init(user.uid)
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });


        //console.log(driverList);
        setIsLoading(false);
    }, []);
    const init = (uid) => {
        VehicleRepository.getCurrentlyAssignedVehicleByDriverId(uid)
            .then((response) => {
                // console.log(response)
                // setIssuedvehicleid(response["issuedVehicleId"])
                VehicleRepository.getVehicleTrip(response["issuedVehicleId"], '')
                    .then((response) => {
                        //console.log(response);
                        const result = Object.values(response.tripList);
                        //console.log(result);
                        setTripList({
                            ...tripList,
                            result
                        })
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error))
                    })
            })
            .catch((error) => {
                console.log(JSON.stringify(error))
            })


    }
    const filter = filterstring => {
        //console.log(filterstring);
        // ContractRepository.getContract(filterstring)
        //     .then((response) => {
        //         //console.log(response);
        //         const result = Object.values(response.contractList);
        //         //console.log(result);
        //         (result === null ? setIsNull(true) : setIsNull(false))
        //         setTripList({
        //             ...tripList,
        //             result
        //         })
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        VehicleRepository.getCurrentlyAssignedVehicleByDriverId(user.uid)
            .then((response) => {
                // console.log(response)
                // setIssuedvehicleid(response["issuedVehicleId"])
                VehicleRepository.getVehicleTrip(response["issuedVehicleId"], filterstring)
                    .then((response) => {
                        //console.log(response);
                        const result = Object.values(response.tripList);
                        //console.log(result);
                        setTripList({
                            ...tripList,
                            result
                        })
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error))
                    })
            })
            .catch((error) => {
                console.log(JSON.stringify(error))
            })
        setSelectedStatus("");
        setDepartureTime("");
        setDestinationTime("");
    }

    const [tripList, setTripList] = useState([{
    }
    ])
    const [isNull, setIsNull] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [isDepartureVisible, setIsDepartureVisible] = useState(false);
    const [destinationTime, setDestinationTime] = useState("");
    const [isDestinationVisible, setIsDestinationVisible] = useState(false);
    let Image_Http_URL = { uri: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/80742826_2481110258768067_7881332290297528320_o.jpg?_nc_cat=104&ccb=2&_nc_sid=09cbfe&_nc_ohc=xABpuTzKeNkAX9UlkVS&_nc_ht=scontent.fsgn2-5.fna&oh=ba9257d410d63d4dd10fc28bf9d9bfb6&oe=5FBF8173" };
    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Drivers" />
            <ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                        <Card style={styles.margin} title="Filter options">
                            <Block row style={{ marginBottom: 25 }}>
                                <Input
                                    label="Departure from"
                                    style={{ marginRight: 15, width: width - 200 }}
                                    value={departureTime}
                                    //onChangeText={text => setDepartureTime(text)}
                                    onFocus={() => setIsDepartureVisible(true)}
                                //onPress={setIsDepartureVisible(true)}
                                />
                                <DateTimePickerModal
                                    isVisible={isDepartureVisible}
                                    mode="datetime"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setDepartureTime(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`)
                                        console.log(departureTime)
                                        setIsDepartureVisible(false)
                                    }}
                                    onCancel={text => setIsDepartureVisible(false)}
                                />
                                <Input
                                    label="Destination to"
                                    style={{ width: width - 200 }}
                                    value={destinationTime}
                                    //onChangeText={text => setDestinationTime(text)}
                                    //onPress={setIsDestinationVisible(true)}
                                    onFocus={text => setIsDestinationVisible(true)}
                                />
                                <DateTimePickerModal
                                    isVisible={isDestinationVisible}
                                    mode="datetime"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setDestinationTime(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()} ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`)
                                        console.log(destinationTime)
                                        setIsDestinationVisible(false)
                                    }}
                                    onCancel={text => setIsDestinationVisible(false)}
                                />
                            </Block>
                            <Text caption medium style={styles.label}>
                                Trip status
                            </Text>
                            <DropDownPicker
                                items={[
                                    { label: 'FINISHED', value: 'FINISHED' },
                                    { label: 'UNFINISHED', value: 'UNFINISHED' },
                                ]}
                                defaultValue={selectedStatus}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                onChangeItem={item => setSelectedStatus(item.value)}
                            />
                            <Button center style={styles.margin}
                                onPress={() => {
                                    //selectedStatus === "" ? (filter(`?departureTime=${departureTime}&destinationTime=${destinationTime}&viewOption=0`)) : (filter(`?departureTime=${departureTime}&destinationTime=${destinationTime}&contractStatus=${selectedStatus}&viewOption=1`))
                                    filter(`?departureTime=${departureTime}&destinationTime=${destinationTime}`);
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text color="white">
                                    Filter
            </Text>
                            </Button>
                        </Card>
                    </ScrollView>
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
                <Card row style={[styles.marginCard], { backgroundColor: theme.colors.gray2, height: 30 }} border="false" shadow="false">
                    <Block style={{ flex: 0.4 }} >
                        <Text medium caption style={[styles.label]}>
                            ID
                    </Text>
                    </Block>
                    <Block style={{ flex: 1.5 }}>
                        <Text medium caption style={[styles.label]}>
                            Departure time
        </Text>
                    </Block>
                    <Block style={{ flex: 1.5 }}>
                        <Text medium caption style={[styles.label]}>
                            Destination time
        </Text>
                    </Block>
                    <Block style={{ flex: 1.2 }}>
                        <Text medium caption style={[styles.label]}>
                            Status
        </Text>
                    </Block>
                </Card>
                {isNull === true ? (
                    <Block >
                        <Text medium caption style={[styles.label, { marginLeft: 14 }]}>
                            Status
                    </Text>
                    </Block>
                ) : (
                        <FlatList
                            data={tripList.result}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        // setIsLoading(true);
                                        // setIsLoading(false);
                                        navigation.navigate("TripDetail", {
                                            itemId: item["contractId"],
                                            contractVehicleId: item["contractVehicleId"],
                                            vehicleStatus: item["contractVehicleStatus"]
                                        })
                                    }}
                                >
                                    <Card center row style={[styles.marginCard]} style={{
                                        borderColor: theme.colors.lightBlue,
                                        borderWidth: 1,
                                    }}>
                                        <Block style={{ flex: 0.4 }} >
                                            <Text medium>
                                                {item["contractId"]}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 1.5 }}>
                                            <Text medium>
                                                {item["departureTime"]}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 1.5 }}>
                                            <Text medium>
                                                {item["destinationTime"]}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 1.3 }}>
                                            {item["contractVehicleStatus"] === "FINISHED" ? (<Text color="green" medium>
                                                {item["contractVehicleStatus"]}
                                            </Text>) : (<Text medium color="yellow">
                                                {item["contractVehicleStatus"]}
                                            </Text>)}

                                        </Block>

                                    </Card>
                                </TouchableOpacity>}
                        />
                    )
                }

            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView >
    );
};

export default TripsScreen;