import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
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
    const { lastRefresh } = route.params;
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [issuedvehicleid, setIssuedvehicleid] = useState('');
    const [vehicleId, setVehicleId] = useState('');
    const [vehicleStatusList, setVehicleStatusList] = useState([])
    const [vehicle, setVehicle] = useState({});
    const isFocused = useIsFocused();
    useEffect(() => {
        console.log(tripList.length)
        setVehicleStatusList([])
        getCurrentUser()
            .then((user) => {
                setUser(user);
                initVehicleStatusList();
                initvehicleid(user.uid)
                setImage_Http_URL({ uri: user["photoURL"] });
                setUsername(user["displayName"]);
                init(user.uid)
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });


        //console.log(driverList);
        setIsLoading(false);
    }, [isFocused]);
    const init = async (uid) => {
        setIsLoading(true)
        await VehicleRepository.getCurrentlyAssignedVehicleByDriverId(uid)
            .then((response) => {
                setVehicleId(response["vehicleId"])
                // console.log(response)
                // setIssuedvehicleid(response["issuedVehicleId"])
                VehicleRepository.getVehicleTrip(response["issuedVehicleId"], '')
                    .then((response) => {
                        //console.log(response);
                        const result = Object.values(response);
                        //console.log(result);
                        setTripList(response)
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error))
                    })
            })
            .catch((error) => {
                console.log(JSON.stringify(error))
            })
        setIsLoading(false)

    }
    const filter = async (filterstring) => {
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
        setIsLoading(true)
        await VehicleRepository.getCurrentlyAssignedVehicleByDriverId(user.uid)
            .then((response) => {
                // console.log(response)
                // setIssuedvehicleid(response["issuedVehicleId"])
                VehicleRepository.getVehicleTrip(response["issuedVehicleId"], filterstring)
                    .then((response) => {
                        //console.log(response);
                        //const result = Object.values(response.tripList);
                        //console.log(result);
                        setTripList(response)
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error))
                    })
            })
            .catch((error) => {
                console.log(JSON.stringify(error))
            })
        resetFilter()
        setIsLoading(false)

    }
    const resetFilter = () => {
        setSelectedStatus("");
        setDepartureTime("");
        setDestinationTime("");
    }
    const initvehicleid = async (userId) => {
        setIsLoading(true)
        await VehicleRepository.getCurrentlyAssignedVehicleByDriverId(userId)
            .then(async (response) => {
                await VehicleRepository.getDetailVehicle(response.vehicleId)
                    .then((response) => {
                        response !== null ? setVehicle(response) : setVehicle({})

                        // response["vehicleType"]["vehicleTypeName"] !== null ? setVehicleType(response["vehicleType"]["vehicleTypeName"]) : setVehicleType('')
                        // response["brand"]["brandName"] !== null ? setBrandName(response["brand"]["brandName"]) : setBrandName('')
                        // response["assignedDriver"]["userName"] !== null ? setDriverName(response["assignedDriver"]["userName"]) : setDriverName('')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                // await DocumentRepository.getVehicleDocument(`?vehicleId=${response.vehicleId}&viewOption=1`)
                //     .then((response) => {

                //         response !== null ? setVehicleDocument(response) : setVehicleDocument([])
                //     })
                //     .catch((error) => {
                //         console.log(error)
                //     })
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const initVehicleStatusList = async () => {
        setIsLoading(true)
        await ContractRepository.getContractVehicleStatus()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setVehicleStatusList(prevArray => [
                        ...prevArray, {
                            label: result[i],
                            value: result[i]
                        }
                    ])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }

    const [tripList, setTripList] = useState([])
    const [isNull, setIsNull] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [isDepartureVisible, setIsDepartureVisible] = useState(false);
    const [destinationTime, setDestinationTime] = useState("");
    const [isDestinationVisible, setIsDestinationVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [Image_Http_URL, setImage_Http_URL] = useState({});
    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Trips" />
            <ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {

                        setModalVisible(!modalVisible);
                    }}
                >
                    <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                        <Card style={styles.margin} title="Filter options">
                            {/* <Block row style={{ marginBottom: 25 }}>
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
                            </Block> */}
                            <Text caption medium style={styles.label}>
                                Trip status
                            </Text>
                            <DropDownPicker
                                items={vehicleStatusList}
                                defaultValue={selectedStatus}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 60 }}
                                onChangeItem={item => setSelectedStatus(item.value)}
                            />
                            <Button center style={styles.margin}
                                onPress={() => {
                                    //selectedStatus === "" ? (filter(`?departureTime=${departureTime}&destinationTime=${destinationTime}&viewOption=0`)) : (filter(`?departureTime=${departureTime}&destinationTime=${destinationTime}&contractStatus=${selectedStatus}&viewOption=1`))
                                    filter(`?vehicleStatus=${selectedStatus}`);
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
                            <Text style={{ paddingHorizontal: 16, marginTop: 3 }}>{username}</Text>
                            <Text ligth caption style={{ paddingHorizontal: 16, marginTop: 3 }}>Driver</Text>
                        </Block>

                    </Block>
                    <Block row>

                        <Button style={styles.marginButton} onPress={() => {
                            //setVehicleStatusList([]);
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
                            No
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
                {tripList.length === 0 ? (
                    <Block style={{ marginTop: 15 }} center>
                        <Image
                            style={{ width: width - 100, height: width - 100 }}
                            source={ // if clicked a new img
                                require('../assets/images/emptylist.png')} //else show random
                        />
                        <Text large center caption >
                            LIST IS EMPTY
                    </Text>
                    </Block>
                ) : (
                        <FlatList
                            data={tripList}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity
                                    onPress={() => {
                                        // setIsLoading(true);
                                        // setIsLoading(false);
                                        navigation.navigate("TripDetail", {
                                            contractId: item["contractId"],
                                            contractVehicleId: item["contractVehicleId"],
                                            vehicleStatus: item["contractVehicleStatus"],
                                            vehicleId: vehicleId,
                                            contractTrips: item["contractTrip"],
                                            curVehicleStatus: vehicle["vehicleStatus"]
                                        })
                                        console.log(item["vehicleId"])
                                    }}
                                >
                                    <Card center row style={[styles.marginCard]} style={{
                                        borderColor: theme.colors.lightBlue,
                                        borderWidth: 1,
                                    }}>
                                        <Block style={{ flex: 0.4 }} >
                                            <Text medium>
                                                {index + 1}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 1.5 }}>
                                            <Text medium>
                                                {item["contractTrip"]["departureTime"]}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 1.5 }}>
                                            <Text medium>
                                                {item["contractTrip"]["destinationTime"]}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 1.3 }}>
                                            {item["contractVehicleStatus"] === "COMPLETED" ? (<Text color="green" medium>
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
