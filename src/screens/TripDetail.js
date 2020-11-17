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
    const [passengerVisible, setPassengerVisible] = useState(false);
    const { itemId, contractVehicleId, vehicleStatus, lastRefresh } = route.params;
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageIndex, setimageIndex] = useState(0);
    const [selectedVehicleStatus, setSelectedVehicleStatus] = useState('');
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const renderImages = (item, parindex) => (
        // <TouchableOpacity onPress={() => {
        //     setimageIndex(index)
        //     setshowModal(1)
        // }}>
        //     <Image
        //         source={{ uri: item }}
        //         style={{ height: 100, width: 100, marginBottom: 25, marginRight: 15 }}
        //         center />
        // </TouchableOpacity>
        <FlatList
            data={item["userDocumentImages"]}
            horizontal={true}
            renderItem={({ item, index }) =>
                // <Image source={{ uri: item["imageLink"] }} style={{ height: 100, width: 100, marginBottom: 25, marginRight: 15 }} center />
                //renderImages(item["imageLink"], index)
                <TouchableOpacity onPress={() => {
                    setimageIndex(index)
                    setshowModal(parindex)
                }}>
                    <Image
                        source={{ uri: item["imageLink"] }}
                        style={{ height: 100, width: 100, marginBottom: 25, marginRight: 15 }}
                        center />
                </TouchableOpacity>
            } />
    )

    useEffect(() => {
        setIsLoading(true);
        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
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

    const _storeData = () => {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => alert('success'));
    };
    const [contract, setContract] = useState({})
    const [passengerList, setPassengerList] = useState([])
    const [passengerAddList, setPassengerAddList] = useState([])
    const [contractOwner, setContractOwner] = useState(null)
    const [addName, setAddName] = useState('')
    const [addPhone, setAddPhone] = useState('')
    const [addBirth, setAddBirth] = useState('')
    const [addAddress, setAddAddress] = useState('')
    const init = () => {
        ContractRepository.getDetailContract(itemId)
            .then((response) => {
                //console.log(response);
                //const result = Object.entries(response);
                //console.log(response["userId"]);
                //console.log(result["userId"]);
                // setDriver({
                //     ...driver,
                //     result
                // })
                setContract(response);
                setContractOwner(response["contractOwner"]["userName"])
                //console.log(driver["userDocumentList"][0]["userDocumentImages"][0]["imageLink"]);
                //console.log(driver[10][0].userDocumentImages);
            })
            .catch((error) => {
                console.log(error)
            })
        ContractRepository.getPassengerList(`?contractVehicleId=${contractVehicleId}`)
            .then((response) => {
                //console.log(response);
                //const result = Object.entries(response);
                //console.log(response["userId"]);
                //console.log(result["userId"]);
                // setDriver({
                //     ...driver,
                //     result
                // })
                setPassengerList(response);
                //console.log(driver["userDocumentList"][0]["userDocumentImages"][0]["imageLink"]);
                //console.log(driver[10][0].userDocumentImages);
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(contractVehicleId)
    }
    const initPassengerList = () => {
        ContractRepository.getPassengerList(`?contractVehicleId=${contractVehicleId}`)
            .then((response) => {
                setPassengerList(response);
            })
            .catch((error) => {
                console.log(error)
            })
        console.log(contractVehicleId)
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
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Back to trip detail',
                            onPress: () => navigation.navigate("TripDetail", {
                                lastRefresh: Date(Date.now()).toString(),
                                itemId: itemId,
                                contractVehicleId: contractVehicleId
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
    const updatestatus = () => {
        let data = {
            contractVehicleId: contractVehicleId,
            vehicleStatus: selectedVehicleStatus
        }
        ContractRepository.updateContractVehicleStatus(data)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Updated',
                    'Status updated!!',
                    [
                        {
                            text: 'Back to trip detail',
                            onPress: () => navigation.navigate("TripDetail", {
                                lastRefresh: Date(Date.now()).toString(),
                                itemId: itemId,
                                vehicleStatus: selectedVehicleStatus,
                                contractVehicleId: contractVehicleId
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
        //setPassengerAddList([])
    }

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Trip Detail" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Trip Detail">
                    <Block column center style={{ marginTop: 10 }}>
                        <Block style={{ marginBottom: 25 }}>
                            {vehicleStatus === "FINISHED" ? (<Text color="green" medium>
                                STATUS: {vehicleStatus}
                            </Text>) : (<Text medium color="yellow">
                                STATUS: {vehicleStatus}
                            </Text>)}
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={statusModalVisible}
                                onRequestClose={() => {
                                    Alert.alert("Modal has been closed.");
                                }}
                            >
                                <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                                    <Card style={styles.margin} title="List passenger">
                                        <Block column style={{ marginBottom: 25 }}>
                                            <Text caption medium style={styles.label}>
                                                Select status to update
                            </Text>
                                            <DropDownPicker
                                                items={[
                                                    { label: 'NOT_STARTED', value: 'NOT_STARTED' },
                                                    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
                                                    { label: 'ON_SCHEDULE', value: 'ON_SCHEDULE' },
                                                    { label: 'DELAYED', value: 'DELAYED' },
                                                    { label: 'COMPLETED', value: 'COMPLETED' },
                                                    { label: 'DROPPED', value: 'DROPPED' },
                                                ]}
                                                defaultValue={selectedVehicleStatus}
                                                //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                                placeholder="Select status"
                                                containerStyle={{ height: 40, width: width - 100, marginBottom: 25 }}
                                                onChangeItem={item => setSelectedVehicleStatus(item.value)}
                                            />
                                        </Block>
                                        <Button center style={styles.margin, { marginBottom: 15 }}
                                            onPress={() => {
                                                updatestatus()
                                                setStatusModalVisible(!statusModalVisible)
                                            }}
                                        >
                                            <Text color="white">
                                                Update
            </Text>
                                        </Button>
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
                                            } />
                                    </Card>
                                </ScrollView>
                            </Modal>
                            <TouchableOpacity
                                onPress={() => {
                                    // setIsLoading(true);
                                    // setIsLoading(false);
                                    // navigation.navigate("TripDetail", {
                                    //     itemId: item["contractId"],
                                    //     contractVehicleId: item["contractVehicleId"]
                                    // })
                                    setStatusModalVisible(!statusModalVisible)
                                }}
                            >
                                <Block row style={{ marginTop: 5 }}>
                                    <Icon name="cw" style={{ marginRight: 5 }} />
                                    <Text medium caption>
                                        UPDATE STATUS
                            </Text>

                                </Block>

                            </TouchableOpacity>
                        </Block>
                        <Input
                            full
                            label="Contract Id"
                            value={JSON.stringify(contract["contractId"])}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Owner"
                            value={contractOwner}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Signed Date"
                            value={contract["signedDate"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            multiline={true}
                            full
                            label="Signed Location"
                            value={contract["signedLocation"]}
                            style={{ marginBottom: 25, height: 80, textAlignVertical: "top" }}
                            editable={false}
                        />

                        <Block row style={{ marginBottom: 25 }}>
                            <Input
                                full
                                label="Duration From"
                                value={contract["durationFrom"]}
                                style={{ marginRight: 15, width: width - 190 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Duration to"
                                value={contract["durationTo"]}
                                style={{ width: width - 190 }}
                                editable={false}
                            />
                        </Block>
                        <Input
                            full
                            multiline={true}
                            label="Departure Location"
                            value={contract["departureLocation"]}
                            style={{ marginBottom: 25, height: 80, textAlignVertical: "top" }}
                            editable={false}
                        />
                        <Input
                            full
                            multiline={true}
                            label="Destination Location"
                            value={contract["destinationLocation"]}
                            style={{ marginBottom: 25, height: 80, textAlignVertical: "top" }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Departure Time"
                            value={contract["departureTime"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Destination Time"
                            value={contract["destinationTime"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Total Price"
                            value={JSON.stringify(contract["totalPrice"])}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Other Information"
                            value={contract["otherInformation"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />

                        <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
                            setPassengerVisible(!passengerVisible)
                            //initPassengerList()
                        }}>
                            <Block row center>
                                <Text color="white">
                                    View Passenger
                            </Text>
                                {passengerVisible ? <Icon name="chevron-small-up" size={15} color="white" style={{ alignItems: 'flex-end' }} /> : <Icon name="chevron-small-down" size={15} color="white" style={{ alignItems: 'flex-end' }} />}
                            </Block>
                        </Button>
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
                            </Block>) : (<Block row style={{ marginTop: 10, marginBottom: 15 }}>
                                <Block column>
                                    <Block column style={styles.margin, { marginBottom: 10 }}>
                                        <Text style={{ marginLeft: 10 }} color="black3">Passenger list not applied yet :((</Text>
                                    </Block>
                                    <Button center style={styles.margin, { marginBottom: 10 }}
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
                                        Alert.alert("Modal has been closed.");
                                    }}
                                >
                                    <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                                        <Card style={styles.margin} title="List passenger">
                                            <Block column style={{ marginBottom: 25 }}>
                                                <Input
                                                    label="Full name"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addName}
                                                    onChangeText={text => setAddName(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                                <Input
                                                    label="Phone number"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addPhone}
                                                    onChangeText={text => setAddPhone(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                                <Input
                                                    label="Date of birth"
                                                    style={{ marginRight: 15, width: width - 100, marginBottom: 15 }}
                                                    value={addBirth}
                                                    onChangeText={text => setAddBirth(text)}
                                                //onFocus={() => setIsDepartureVisible(true)}
                                                //onPress={setIsDepartureVisible(true)}
                                                />
                                                <Input
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
                                                } />
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
