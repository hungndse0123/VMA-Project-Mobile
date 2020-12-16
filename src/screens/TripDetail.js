import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
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
import moment from 'moment';

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
        console.log(lastRefresh);
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
    //const [selectedContractTripId, setSelectedContractTripId] = useState(contractTrips[0])
    const [cityData, setCityData] = useState([
        {
            label: "Thành phố Cần Thơ",
            value: "Thành phố Cần Thơ"
        },
        {
            label: "Tỉnh Bạc Liêu",
            value: "Tỉnh Bạc Liêu"
        },
        {
            label: "Tỉnh Bắc Ninh",
            value: "Tỉnh Bắc Ninh"
        },
        {
            label: "Tỉnh Bến Tre",
            value: "Tỉnh Bến Tre"
        },
        {
            label: "Tỉnh Bình Định",
            value: "Tỉnh Bình Định"
        },
        {
            label: "Tỉnh Bình Dương",
            value: "Tỉnh Bình Dương"
        },
        {
            label: "Tỉnh Bình Phước",
            value: "Tỉnh Bình Phước"
        },
        {
            label: "Tỉnh Bình Thuận",
            value: "Tỉnh Bình Thuận"
        },
        {
            label: "Tỉnh Cà Mau",
            value: "Tỉnh Cà Mau"
        },
        {
            label: "Tỉnh Cao Bằng",
            value: "Tỉnh Cao Bằng"
        },
        {
            label: "Tỉnh Đắk Lắk",
            value: "Tỉnh Đắk Lắk"
        },
        {
            label: "Thành phố Đà Nẵng",
            value: "Thành phố Đà Nẵng"
        },
        {
            label: "Tỉnh Đắk Nông",
            value: "Tỉnh Đắk Nông"
        },
        {
            label: "Tỉnh Điện Biên",
            value: "Tỉnh Điện Biên"
        },
        {
            label: "Tỉnh Đồng Nai",
            value: "Tỉnh Đồng Nai"
        },
        {
            label: "Tỉnh Đồng Tháp",
            value: "Tỉnh Đồng Tháp"
        },
        {
            label: "Tỉnh Gia Lai",
            value: "Tỉnh Gia Lai"
        },
        {
            label: "Tỉnh Hà Giang",
            value: "Tỉnh Hà Giang"
        },
        {
            label: "Tỉnh Hà Nam",
            value: "Tỉnh Hà Nam"
        },
        {
            label: "Tỉnh Hà Tĩnh",
            value: "Tỉnh Hà Tĩnh"
        },
        {
            label: "Tỉnh Hải Dương",
            value: "Tỉnh Hải Dương"
        },
        {
            label: "Tỉnh Hậu Giang",
            value: "Tỉnh Hậu Giang"
        },
        {
            label: "Thành phố Hà Nội",
            value: "Thành phố Hà Nội"
        },
        {
            label: "Tỉnh Hoà Bình",
            value: "Tỉnh Hoà Bình"
        },
        {
            label: "Tỉnh Hưng Yên",
            value: "Tỉnh Hưng Yên"
        },
        {
            label: "Tỉnh Khánh Hòa",
            value: "Tỉnh Khánh Hòa"
        },
        {
            label: "Tỉnh Kiên Giang",
            value: "Tỉnh Kiên Giang"
        },
        {
            label: "Tỉnh Kon Tum",
            value: "Tỉnh Kon Tum"
        },
        {
            label: "Tỉnh Lào Cai",
            value: "Tỉnh Lào Cai"
        },
        {
            label: "Tỉnh Lai Châu",
            value: "Tỉnh Lai Châu"
        },
        {
            label: "Tỉnh Lâm Đồng",
            value: "Tỉnh Lâm Đồng"
        },
        {
            label: "Tỉnh Lạng Sơn",
            value: "Tỉnh Lạng Sơn"
        },
        {
            label: "Tỉnh Long An",
            value: "Tỉnh Long An"
        },
        {
            label: "Thành phố Hải Phòng",
            value: "Thành phố Hải Phòng"
        },
        {
            label: "Tỉnh Nam Định",
            value: "Tỉnh Nam Định"
        },
        {
            label: "Tỉnh Nghệ An",
            value: "Tỉnh Nghệ An"
        },
        {
            label: "Tỉnh Ninh Bình",
            value: "Tỉnh Ninh Bình"
        },
        {
            label: "Tỉnh Ninh Thuận",
            value: "Tỉnh Ninh Thuận"
        },
        {
            label: "Tỉnh Phú Thọ",
            value: "Tỉnh Phú Thọ"
        },
        {
            label: "Tỉnh Phú Yên",
            value: "Tỉnh Phú Yên"
        },
        {
            label: "Tỉnh Quảng Bình",
            value: "Tỉnh Quảng Bình"
        },
        {
            label: "Tỉnh Quảng Nam",
            value: "Tỉnh Quảng Nam"
        },
        {
            label: "Tỉnh Quảng Ngãi",
            value: "Tỉnh Quảng Ngãi"
        },
        {
            label: "Tỉnh Quảng Ninh",
            value: "Tỉnh Quảng Ninh"
        },
        {
            label: "Thành phố Hồ Chí Minh",
            value: "Thành phố Hồ Chí Minh"
        },
        {
            label: "Tỉnh Quảng Trị",
            value: "Tỉnh Quảng Trị"
        },
        {
            label: "Tỉnh Sóc Trăng",
            value: "Tỉnh Sóc Trăng"
        },
        {
            label: "Tỉnh Sơn La",
            value: "Tỉnh Sơn La"
        },
        {
            label: "Tỉnh Tây Ninh",
            value: "Tỉnh Tây Ninh"
        },
        {
            label: "Tỉnh Thái Bình",
            value: "Tỉnh Thái Bình"
        },
        {
            label: "Tỉnh Thái Nguyên",
            value: "Tỉnh Thái Nguyên"
        },
        {
            label: "Tỉnh Thanh Hóa",
            value: "Tỉnh Thanh Hóa"
        },
        {
            label: "Tỉnh Thừa Thiên Huế",
            value: "Tỉnh Thừa Thiên Huế"
        },
        {
            label: "Tỉnh Tiền Giang",
            value: "Tỉnh Tiền Giang"
        },
        {
            label: "Tỉnh Trà Vinh",
            value: "Tỉnh Trà Vinh"
        },
        {
            label: "Tỉnh An Giang",
            value: "Tỉnh An Giang"
        },
        {
            label: "Tỉnh Tuyên Quang",
            value: "Tỉnh Tuyên Quang"
        },
        {
            label: "Tỉnh Vĩnh Long",
            value: "Tỉnh Vĩnh Long"
        },
        {
            label: "Tỉnh Vĩnh Phúc",
            value: "Tỉnh Vĩnh Phúc"
        },
        {
            label: "Tỉnh Yên Bái",
            value: "Tỉnh Yên Bái"
        },
        {
            label: "Tỉnh Bà Rịa - Vũng Tàu",
            value: "Tỉnh Bà Rịa - Vũng Tàu"
        },
        {
            label: "Tỉnh Bắc Giang",
            value: "Tỉnh Bắc Giang"
        },
        {
            label: "Tỉnh Bắc Kạn",
            value: "Tỉnh Bắc Kạn"
        },
    ])

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
    const initContractVehicleStatus = async () => {
        setIsLoading(true)
        await ContractRepository.getVehicleStatusByVehicleIdAndContractDetailId()
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
        if (passengerAddList.length > 0) {
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
                        JSON.stringify(error["debugMessage"]),
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

    }
    const startstatus = async (DetailId) => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        var datecurrent = new Date(year + '/' + month + '/' + date
            + ' ' + hours + ':' + min + ':' + sec);
        var exDate = new Date(contractTrips["departureTime"].replace(/-/g, '/'));
        if (datecurrent >= exDate) {
            setIsLoading(true)
            let data = {
                contractId: contractId,
                vehicleId: vehicleId,
                contractDetailId: DetailId,
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
                                    vehicleStatus: "IN_PROGRESS"
                                })
                            },
                        ],
                        { cancelable: false }
                    );
                })
                .catch((error) => {
                    Alert.alert(
                        'Error',
                        JSON.stringify(error["debugMessage"]),
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
        } else {
            Alert.alert(
                'Error',
                "It's not time to start trip yet!!!!",
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                    //{ text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            );
        }

        //setPassengerAddList([])
    }

    const endstatus = async (DetailId) => {
        setIsLoading(true)
        let data = {
            contractId: contractId,
            vehicleId: vehicleId,
            contractDetailId: DetailId,
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
                                vehicleStatus: "COMPLETED"
                            })
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    JSON.stringify(error["debugMessage"]),
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
                                        startstatus(contractTrips["contractTripId"])
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
                                        endstatus(contractTrips["contractTripId"])
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
                                    <Text h4 style={{ marginBottom: 15 }} color="brown">Trip</Text>

                                </Block>
                                <Block row>
                                    <Block column>

                                        <Text style={{ marginLeft: 10 }} color="black">Contract Trip Id: <Text style={{ marginLeft: 10 }} color="black3">{contractTrips["contractTripId"]}</Text></Text>
                                        <Text style={{ marginLeft: 10 }} color="black">Departure Location: <Text style={{ marginLeft: 10 }} color="black3">{contractTrips["departureLocation"]}</Text></Text>
                                        <Text style={{ marginLeft: 10 }} color="black">Destination Location: <Text style={{ marginLeft: 10 }} color="black3">{contractTrips["destinationLocation"]}</Text></Text>
                                        <Text style={{ marginLeft: 10 }} color="black">Departure Time: <Text style={{ marginLeft: 10 }} color="black3">{contractTrips["departureTime"]}</Text></Text>
                                        <Text style={{ marginLeft: 10 }} color="black">Destination Time: <Text style={{ marginLeft: 10 }} color="black3">{contractTrips["destinationTime"]}</Text></Text>
                                        <Text style={{ marginLeft: 10 }} color="black">Locations: </Text>
                                        <FlatList data={contractTrips["locations"]} renderItem={({ item, index }) => <Text column style={{ marginLeft: 10 }} color="black">+ Location {index + 1}: <Text column color="black3">{item["location"]}</Text></Text>} />

                                    </Block>
                                </Block>
                            </Block>
                        </TouchableWithoutFeedback>

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
                        {/* <Button center style={styles.margin, { marginBottom: 15 }}
                            onPress={() => {
                                var date = new Date().getDate(); 
                                var month = new Date().getMonth() + 1; 
                                var year = new Date().getFullYear(); 
                                var hours = new Date().getHours(); 
                                var min = new Date().getMinutes(); 
                                var sec = new Date().getSeconds(); 
                                var datecurrent = new Date(year + '/' + month + '/' + date
                                    + ' ' + hours + ':' + min + ':' + sec);
                                var exDate = new Date(contractTrips["destinationTime"].replace(/-/g, '/'));
                                console.log(datecurrent)
                                console.log(exDate)
                                console.log(exDate < datecurrent)
                            }}
                        >
                            <Text color="white">
                                check
            </Text>
                        </Button> */}
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
                                                        setAddBirth(`${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`)
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
