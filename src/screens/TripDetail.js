import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import ContributorRepository from '../repositories/ContributorRepository';
import UserRepository from '../repositories/UserRepository';
import ContractRepository from '../repositories/ContractRepository';
import VehicleRepository from '../repositories/VehicleRepository';

import { Alert, Dimensions, Modal, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, FlatList, AsyncStorage } from "react-native";
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
import Loader from '../components/Loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width } = Dimensions.get("window");

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
    const [username, setUsername] = useState('');
    const [passengerVisible, setPassengerVisible] = useState(false);
    const { vehicleId, contractId, contractVehicleId, vehicleStatus, lastRefresh, contractTrips } = route.params;
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageIndex, setimageIndex] = useState(0);
    const [selectedVehicleStatus, setSelectedVehicleStatus] = useState('');
    const [statusModalVisible, setStatusModalVisible] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                setSelectedVehicleStatus(vehicleStatus)
                setUsername(user.displayName)
                init();
                getStatus(user.uid);
                //console.log(Profile_Image);
                setIsLoading(false);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });
    }, [isFocused]);

    const [contract, setContract] = useState({})
    const [passengerList, setPassengerList] = useState([])
    const [passengerAddList, setPassengerAddList] = useState([])
    const [vehicleStatusList, setVehicleStatusList] = useState([])
    const [schedule, setSchedule] = useState([])
    const [contractOwner, setContractOwner] = useState(null)
    const [addName, setAddName] = useState('')
    const [addPhone, setAddPhone] = useState('')
    const [addBirth, setAddBirth] = useState('')
    const [addAddress, setAddAddress] = useState('')
    const [isBirthDateVisible, setIsBirthDateVisible] = useState(false)


    const init = () => {
        setVehicleStatusList([])
        initVehicleStatusList()
        initPassengerList()
        console.log(contractVehicleId)
    }
    const initPassengerList = async () => {
        setIsLoading(true)
        await ContractRepository.getPassengerList(`?contractVehicleId=${contractVehicleId}`)
            .then((response) => {
                setPassengerList(response);
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
        //console.log(contractVehicleId)
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
    const getStatus = (uid) => {
        VehicleRepository.getVehicleTrip(`/${uid}`)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.tripHistory);
                //console.log(result);
                setTripList({
                    ...tripList,
                    result
                })
            })
            .catch((error) => {
                console.log(JSON.stringify(error))
            })
        console.log(contractVehicleId)
    }
    const createPassengerList = () => {
        let listpassenger = {
            contractVehicleId: contractVehicleId,
            passengerList: passengerAddList
        }
        ContractRepository.createPassengerList(listpassenger)
            .then((response) => {
                console.log(response.status)
                setPassengerVisible(!passengerVisible)
                initPassengerList()
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Back to trip detail',
                            onPress: () => navigation.navigate("TripDetail", {
                                lastRefresh: Date(Date.now()).toString(),
                                contractId: contractId,
                                contractVehicleId: contractVehicleId,
                                vehicleId: vehicleId,
                                contractTrips: contractTrips,
                                vehicleStatus: selectedVehicleStatus
                            })
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    JSON.stringify(error),
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                );
            })
        setPassengerAddList([])
    }
    const startstatus = async () => {
        setIsLoading(true)
        let data = {
            contractId: contractId,
            vehicleId: vehicleId,
        }
        console.log(JSON.stringify(data))
        console.log(JSON.stringify(vehicleId))
        await ContractRepository.startContractVehicle(data)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Started',
                    'Your trip is started!!',
                    [
                        {
                            text: 'Back to trip detail',
                            onPress: () => navigation.navigate("TripDetail", {
                                lastRefresh: Date(Date.now()).toString(),
                                contractId: contractId,
                                contractVehicleId: contractVehicleId,
                                vehicleId: vehicleId,
                                contractTrips: contractTrips,
                                vehicleStatus: selectedVehicleStatus
                            })
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    JSON.stringify(error),
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                );
            })
        setIsLoading(false)
        //setPassengerAddList([])
    }

    const endstatus = async () => {
        setIsLoading(true)
        let data = {
            contractId: contractId,
            vehicleId: vehicleId,
        }
        console.log(JSON.stringify(data))
        console.log(JSON.stringify(vehicleId))
        await ContractRepository.endContractVehicle(data)
            .then((response) => {

                console.log(response.status)
                Alert.alert(
                    'End',
                    'Your trip is end!!',
                    [
                        {
                            text: 'Back to trip detail',
                            onPress: () => navigation.navigate("TripDetail", {
                                lastRefresh: Date(Date.now()).toString(),
                                contractId: contractId,
                                contractVehicleId: contractVehicleId,
                                vehicleId: vehicleId,
                                contractTrips: contractTrips,
                                vehicleStatus: selectedVehicleStatus
                            })
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    JSON.stringify(error),
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                        },
                        { text: 'OK', onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                );
            })
        setIsLoading(false)
        //setPassengerAddList([])
    }

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Trip Detail" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Trip Detail">
                    <Block column center style={{ marginTop: 10 }}>
                        <Block style={{ marginBottom: 25 }}>
                            {vehicleStatus === "COMPLETED" ? (<Text color="green" medium>
                                STATUS: {vehicleStatus}
                            </Text>) : (<Text medium color="yellow">
                                STATUS: {vehicleStatus}
                            </Text>)}
                            {vehicleStatus === "NOT_STARTED" ?
                                (<TouchableOpacity
                                    onPress={() => {
                                        // setIsLoading(true);
                                        // setIsLoading(false);
                                        // navigation.navigate("TripDetail", {
                                        //     itemId: item["contractId"],
                                        //     contractVehicleId: item["contractVehicleId"]
                                        // })
                                        setSelectedVehicleStatus("IN_PROGRESS")
                                        startstatus()
                                    }}
                                >
                                    <Block center row style={{ marginTop: 5 }}>
                                        <Icon name="aircraft-take-off" style={{ marginLeft: 20, marginRight: 5 }} />
                                        <Text medium caption>
                                            START TRIP
                            </Text>

                                    </Block>

                                </TouchableOpacity>) : (vehicleStatus === "IN_PROGRESS" ? (<TouchableOpacity
                                    onPress={() => {
                                        // setIsLoading(true);
                                        // setIsLoading(false);
                                        // navigation.navigate("TripDetail", {
                                        //     itemId: item["contractId"],
                                        //     contractVehicleId: item["contractVehicleId"]
                                        // })
                                        setSelectedVehicleStatus("COMPLETED")
                                        endstatus()
                                    }}
                                >
                                    <Block row style={{ marginTop: 5 }}>
                                        <Icon name="aircraft-landing" style={{ marginLeft: 20, marginRight: 5 }} />
                                        <Text medium caption>
                                            END TRIP
                            </Text>

                                    </Block>

                                </TouchableOpacity>) : (<></>))}

                        </Block>
                        <Input
                            full
                            label="Contract Id"
                            value={JSON.stringify(contractId)}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                    </Block>
                    <Text caption medium style={styles.label}>
                        CONTRACT TRIPS
                            </Text>
                    <Block column style={{ marginTop: 10 }}>
                        <FlatList
                            data={contractTrips}
                            renderItem={({ item, index }) =>
                                <TouchableWithoutFeedback

                                    style={{ marginBottom: 15 }}
                                >
                                    <Block
                                        style={[
                                            styles.card,
                                            styles.active,
                                            { marginBottom: 15 }
                                        ]}
                                    >
                                        <Block row >
                                            <Text h4 style={{ marginBottom: 15 }} color="brown">Trip No: {index + 1}</Text>
                                        </Block>
                                        <Block row>
                                            <Block column>

                                                <Text style={{ marginLeft: 10 }} color="black3">Contract Trip Id: {item["contractTripId"]}</Text>
                                                <Text style={{ marginLeft: 10 }} color="black3">Departure Location: {item["departureLocation"]}</Text>
                                                <Text style={{ marginLeft: 10 }} color="black3">Destination Location: {item["destinationLocation"]}</Text>
                                                <Text style={{ marginLeft: 10 }} color="black3">Departure Time: {item["departureTime"]}</Text>
                                                <Text style={{ marginLeft: 10 }} color="black3">Destination Time: {item["destinationTime"]}</Text>
                                                <Text style={{ marginLeft: 10 }} color="black3">Locations: </Text>
                                                <FlatList data={item["locations"]} renderItem={({ item, index }) => <Text column style={{ marginLeft: 10 }} color="black3">+ Location {index + 1}: {item["location"]}</Text>} />
                                            </Block>
                                        </Block>
                                    </Block>
                                </TouchableWithoutFeedback>
                            } />
                        <Block center style={{ marginTop: 10 }}>
                            <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
                                setPassengerVisible(!passengerVisible)

                            }}>
                                <Block row center>
                                    <Text color="white">
                                        View Passenger
                            </Text>
                                    {passengerVisible ? <Icon name="chevron-small-up" size={15} color="white" style={{ alignItems: 'flex-end' }} /> : <Icon name="chevron-small-down" size={15} color="white" style={{ alignItems: 'flex-end' }} />}
                                </Block>
                            </Button>
                        </Block>
                        {passengerVisible ? (passengerList.length !== 0 ?
                            (<Block row style={{ marginTop: 10, marginBottom: 15 }}>
                                <FlatList
                                    data={passengerList}
                                    renderItem={({ item, index }) =>
                                        <TouchableWithoutFeedback

                                            style={{ marginBottom: 15 }}
                                        >
                                            <Block
                                                style={[
                                                    styles.card,
                                                    styles.active,
                                                    { marginBottom: 15 }
                                                ]}
                                            >
                                                <Block row>
                                                    <Block column>

                                                        <Text style={{ marginLeft: 10 }} color="black3">Full name: {item["fullName"]}</Text>
                                                        <Text style={{ marginLeft: 10 }} color="black3">Phone number: {item["phoneNumber"]}</Text>
                                                        <Text style={{ marginLeft: 10 }} color="black3">Date of birth: {item["dateOfBirth"]}</Text>
                                                        <Text style={{ marginLeft: 10 }} color="black3">Address: {item["address"]}</Text>
                                                    </Block>
                                                </Block>
                                            </Block>
                                        </TouchableWithoutFeedback>
                                    } />
                            </Block>) : (<Block row style={{ marginBottom: 15 }}>
                                <Block column>
                                    <Block style={{ marginTop: 15 }} center>
                                        <Image
                                            style={{ width: width - 250, height: width - 250 }}
                                            source={ // if clicked a new img
                                                require('../assets/images/emptylist.png')} //else show random
                                        />
                                        <Text large center caption >
                                            LIST IS EMPTY
                    </Text>
                                    </Block>
                                    <Button center style={styles.margin, { marginTop: 15 }}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);
                                        }}
                                    >
                                        <Block row center>
                                            <Text color="white">
                                                Apply passenger list
                            </Text>

                                        </Block>
                                    </Button>
                                </Block>
                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        setModalVisible(!modalVisible)
                                    }}
                                >
                                    <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                                        <Card style={styles.margin} title="List passenger">
                                            <Block column style={{ marginBottom: 25 }}>
                                                <Input
                                                    maxLength={50}
                                                    label="Full name"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addName}
                                                    onChangeText={text => setAddName(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                                <Input
                                                    maxLength={10}
                                                    label="Phone number"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addPhone}
                                                    onChangeText={text => setAddPhone(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                                <Input
                                                    onFocus={() => setIsBirthDateVisible(!isBirthDateVisible)}
                                                    label="Date of birth"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addBirth}
                                                    onChangeText={text => setAddBirth(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                                <DateTimePickerModal
                                                    isVisible={isBirthDateVisible}
                                                    mode="date"
                                                    onConfirm={datetime => {
                                                        //console.log(datetime)
                                                        setAddBirth(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}`)
                                                        //console.log(departureTime)
                                                        setIsBirthDateVisible(!isBirthDateVisible)
                                                    }}
                                                    onCancel={text => setIsBirthDateVisible(!isBirthDateVisible)}
                                                />
                                                <Input
                                                    maxLength={250}
                                                    label="Address"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addAddress}
                                                    onChangeText={text => setAddAddress(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                            </Block>
                                            <Button center style={styles.margin, { marginBottom: 15 }}
                                                onPress={() => {
                                                    setPassengerAddList(prevArray => [
                                                        ...prevArray, {
                                                            fullName: addName,
                                                            phoneNumber: addPhone,
                                                            dateOfBirth: addBirth,
                                                            address: addAddress,
                                                        }

                                                    ])
                                                    setAddName('')
                                                    setAddBirth('')
                                                    setAddPhone('')
                                                    setAddAddress('')
                                                }}
                                            >
                                                <Text color="white">
                                                    Add to list
            </Text>
                                            </Button>
                                            {passengerAddList.length === 0 ? (
                                                <Block style={{ marginTop: 15, marginBottom: 15 }} center>
                                                    <Image
                                                        style={{ width: width - 250, height: width - 250 }}
                                                        source={ // if clicked a new img
                                                            require('../assets/images/emptylist.png')} //else show random
                                                    />
                                                    <Text large center caption >
                                                        LIST IS EMPTY
                    </Text>
                                                </Block>
                                            ) : (
                                                    <FlatList
                                                        data={passengerAddList}
                                                        renderItem={({ item, index }) =>
                                                            <TouchableWithoutFeedback

                                                                style={{ marginBottom: 15 }}
                                                            >
                                                                <Block
                                                                    style={[
                                                                        styles.card,
                                                                        styles.active,
                                                                        { marginBottom: 15 }
                                                                    ]}
                                                                >

                                                                    <Block row>
                                                                        <Block column>

                                                                            <Text style={{ marginLeft: 10 }} color="black3">Full name: {item["fullName"]}</Text>
                                                                            <Text style={{ marginLeft: 10 }} color="black3">Phone number: {item["phoneNumber"]}</Text>
                                                                            <Text style={{ marginLeft: 10 }} color="black3">Date of birth: {item["dateOfBirth"]}</Text>
                                                                            <Text style={{ marginLeft: 10 }} color="black3">Address: {item["address"]}</Text>
                                                                        </Block>
                                                                    </Block>
                                                                </Block>
                                                            </TouchableWithoutFeedback>
                                                        } />)}
                                            <Button center style={styles.margin, { marginBottom: 15 }}
                                                onPress={() => {
                                                    createPassengerList();
                                                    // setPassengerList(
                                                    //     ...passengerList,
                                                    //     passengerAddList
                                                    // )
                                                    setModalVisible(!modalVisible);
                                                    setPassengerVisible(!passengerVisible);
                                                }}
                                            >
                                                <Text color="white">
                                                    Confirm
            </Text>
                                            </Button>
                                        </Card>
                                    </ScrollView>
                                </Modal>
                            </Block>)) : (<></>)
                        }

                    </Block>


                </Card>

            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
