import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import FirebaseRepository from '../repositories/FirebaseRepository';
import VehicleRepository from "../repositories/VehicleRepository";
import RequestRepository from "../repositories/RequestRepository";
import DocumentRepository from "../repositories/DocumentRepository";

import { Alert, Dimensions, Modal, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, FlatList, AsyncStorage } from "react-native";
import { getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import * as theme from '../constants/theme';
import Header from "../components/Header";
import Loader from '../components/Loader';
import ImageViewer from 'react-native-image-zoom-viewer';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker';
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
        },
        addPictureIcon: {
            height: 30,
            width: 30,
            backgroundColor: theme.colors.WHITE,
            borderRadius: 50,
            position: 'absolute',
            left: 65,
            top: 75,
            justifyContent: 'center',
            alignItems: 'center',
            alignItems: 'center',
        }
    });
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [requestType, setRequestType] = useState('');
    const [frontImgUri, setFrontImgUri] = useState('');
    const [backImgUri, setBackImgUri] = useState('');
    const [vehicleDocumentId, setVehicleDocumentId] = useState('');
    const [registeredLocation, setRegisteredLocation] = useState('');
    const [vehicleDocumentType, setVehicleDocumentType] = useState('');
    const [registeredDate, setRegisteredDate] = useState('');
    const [isRegisteredDateVisible, setIsRegisteredDateVisible] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [isExpiryDateVisible, setIsExpiryDateVisible] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState('');

    const [isDocumentVisible, setIsDocumentVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [request, setRequest] = useState({});
    const [brandList, setBrandList] = useState([]);
    const [vehicleDocumentTypeList, setVehicleDocumentTypeList] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(1);
    const [vehicletypeList, setVehicleTypeList] = useState([]);
    const [selectedVehicletype, setSelectedVehicletype] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [chassisNumber, setChassisNumber] = useState('');
    const [distanceDriven, setDistanceDriven] = useState(0);
    const [engineNumber, setEngineNumber] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [model, setModel] = useState('');
    const [origin, setOrigin] = useState('');
    const [seats, setSeats] = useState(0);
    const [yearOfManufacture, setYearOfManufacture] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleList, setVehicleList] = useState([]);
    const [vehicleDocumentList, setVehicleDocumentList] = useState([]);
    const [showModal, setshowModal] = useState(-1);
    const [imageIndex, setimageIndex] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [value, setValue] = useState(0);
    const [isStartDateVisible, setIsStartDateVisible] = useState(false);
    const [isEndDateVisible, setIsEndDateVisible] = useState(false);
    const renderImages = (item, parindex) => (
        <FlatList
            data={item["imageLinks"]}
            horizontal={true}
            renderItem={({ item, index }) =>
                <TouchableOpacity onPress={() => {
                    setimageIndex(index)
                    setshowModal(parindex)
                }}>
                    <Image
                        source={{ uri: item }}
                        style={{ height: width - 250, width: width - 225, marginBottom: 25, marginRight: 15 }}
                        center />
                </TouchableOpacity>
            }
            keyExtractor={(item, index) => index.toString()} />
    )

    useEffect(() => {
        //setIsLoading(true);
        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                initbrand();
                initvehicletype();
                initvehicledocumenttype();
                initvehicle(user.uid);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });
    }, []);
    const chooseImage = (image) => {
        let options = {
            title: 'Select Avatar',
            cameraType: 'front',
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'Images',
            },
            maxWidth: 200,
            maxHeight: 200,
            quality: 0.4
        };
        ImagePicker.showImagePicker(options, (response) => {
            //console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                image === "frontImgUri" ?
                    (setFrontImgUri(response.uri)
                        //SetFrontImg64(response.data)
                        //console.log(response.data)
                    )
                    : image === "backImgUri" ? (setBackImgUri(response.uri)) : (setImageLink(response.uri))
            }
        });
    }
    const [driver, setDriver] = useState({})
    const initvehicle = (uid) => {
        setVehicleList([])
        VehicleRepository.getVehicle(`?ownerId=${uid}`)
            .then((response) => {
                //console.log(response);
                //const result = Object.values(response.vehicleList);
                //console.log(result);
                for (let i = 0; i < response.length; i++)
                    setVehicleList(prevArray => [
                        ...prevArray, {
                            label: response[i]["vehicleId"],
                            value: response[i]["vehicleId"]
                        }
                    ])
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const initbrand = async () => {
        setIsLoading(true)
        await VehicleRepository.getVehicleBrand()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setBrandList(prevArray => [
                        ...prevArray, {
                            label: result[i]["brandName"],
                            value: result[i]["brandId"]
                        }

                    ])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const addVehiceDocument = async () => {
        setIsLoading(true)
        let urlf = await FirebaseRepository.uploadImageToFirebase(frontImgUri, requestType + "_DOCUMENT_FRONT", user.uid)
        let urlb = await FirebaseRepository.uploadImageToFirebase(backImgUri, requestType + "_DOCUMENT_BACK", user.uid)
        setVehicleDocumentList(prevArray => [
            ...prevArray, {
                expiryDate: expiryDate,
                imageLinks: [
                    urlf,
                    urlb
                    // "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/VEHICLE_REGISTRATION_CERTIFICATE-undefined-20201104154407?alt=media&token=41b1790a-42a5-4b30-a242-deef7ab9a718",
                    // "https://firebasestorage.googleapis.com/v0/b/vma-fa20se28.appspot.com/o/VEHICLE_REGISTRATION_CERTIFICATE-undefined-20201104154408?alt=media&token=6b39ecce-7d7b-4abf-880e-cab1e3136b62"
                ],
                registeredDate: registeredDate,
                registeredLocation: registeredLocation.trim(),
                vehicleDocumentId: vehicleDocumentId.trim(),
                vehicleDocumentType: vehicleDocumentType,
            }
        ])
        resetVehicleDocument()
        setIsLoading(false)
    }
    const resetVehicleDocument = () => {
        setExpiryDate('')
        setFrontImgUri('')
        setBackImgUri('')
        setRegisteredDate('')
        setRegisteredLocation('')
        setVehicleDocumentId('')
        setVehicleDocumentType(vehicleDocumentTypeList[0]["value"])
    }
    const resetVehicle = () => {
        setImageLink('')
        setVehicleNumber('')
        setSelectedBrand(brandList[0]["value"])
        setSelectedVehicletype(vehicletypeList[0]["value"])
        setChassisNumber('')
        setEngineNumber('')
        setModel('')
        setOrigin('')
        setYearOfManufacture('')
        setSeats(0)
        setDistanceDriven(0)
        setDescription('')
        setStartDate('')
        setEndDate('')
        setValue(0)
        setVehicleDocumentList([])
    }
    const initvehicledocumenttype = async () => {
        setIsLoading(true)
        await DocumentRepository.getVehicleDocumentType()
            .then((response) => {
                const result = Object.values(response);
                for (let i = 0; i < result.length; i++)
                    setVehicleDocumentTypeList(prevArray => [
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
    const initvehicletype = async () => {
        setIsLoading(true)
        await VehicleRepository.getVehicleType()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setVehicleTypeList(prevArray => [
                        ...prevArray, {
                            label: result[i]["vehicleTypeName"],
                            value: result[i]["vehicleTypeId"]
                        }

                    ])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const getFBLink = async () => {
        setIsLoading(true)
        let newArr = [...vehicleDocumentList];
        for (let i = 0; i < newArr.length; i++) {
            let urlf = await FirebaseRepository.uploadImageToFirebase(newArr[i]["imageLinks"][0], requestType + "_DOCUMENT_FRONT", user.uid)
            let urlb = await FirebaseRepository.uploadImageToFirebase(newArr[i]["imageLinks"][1], requestType + "_DOCUMENT_BACK", user.uid)
            newArr[i]["imageLinks"][0] = urlf;
            newArr[i]["imageLinks"][1] = urlb;
        }
        setVehicleDocumentList(newArr);
        setIsLoading(false)
    }
    const createRequest = async () => {
        setIsLoading(true)
        //await getFBLink()
        let imageLink_url = await FirebaseRepository.uploadImageToFirebase(imageLink, requestType + "_VEHICLE_IMAGE", user.uid)
        let requests = {
            description: description.trim(),
            requestType: requestType,
            vehicleReq: {
                brandId: selectedBrand,
                chassisNumber: chassisNumber.trim(),
                distanceDriven: parseInt(distanceDriven),
                //distanceDriven: 54,
                engineNumber: engineNumber.trim(),
                //imageLink: imageLink_url,
                imageLink: imageLink_url,
                model: model.trim(),
                origin: origin.trim(),
                ownerId: user.uid,
                seats: parseInt(seats),
                //seats: 6,
                vehicleDocuments: vehicleDocumentList,
                vehicleId: vehicleNumber.trim(),
                vehicleTypeId: selectedVehicletype,
                vehicleValue: {
                    endDate: endDate,
                    startDate: startDate,
                    value: parseInt(value),
                    vehicleId: vehicleNumber.trim()
                },
                yearOfManufacture: yearOfManufacture.trim()
            }
        }
        console.log(JSON.stringify(requests))

        await RequestRepository.createVehicleRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Close',
                            onPress: () => navigation.navigate("ContributorVehicleRequest"),
                            style: 'cancel'
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
        console.log("done");
        resetVehicle()
        setIsLoading(false)

    }
    const withdrawRequest = async () => {
        setIsLoading(true)
        let requests = {
            description: description.trim(),
            requestType: requestType,
            vehicleReq: {
                vehicleId: selectedVehicle
            }
        }
        console.log(JSON.stringify(requests))

        await RequestRepository.createVehicleRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Close',
                            onPress: () => navigation.navigate("ContributorVehicleRequest"),
                            style: 'cancel'
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
        console.log("done");
        resetVehicle()
        setIsLoading(false)

    }


    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Vehicle Request" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 20, }} title="Vehicle Request">
                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                        Request type
                            </Text>
                    <DropDownPicker
                        items={[
                            { label: 'Add new vehicle', value: 'ADD_NEW_VEHICLE' },
                            { label: 'Withdraw vehicle', value: 'WITHDRAW_VEHICLE' },
                        ]}
                        defaultValue={requestType}
                        //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                        placeholder="Select type"
                        containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                        onChangeItem={item => setRequestType(item.value)}
                    />

                </Card>
                {requestType === 'ADD_NEW_VEHICLE' ?
                    (<><Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="New Vehicle">
                        <Block column center style={{ marginTop: 10 }}>

                            <TouchableWithoutFeedback
                                onPress={() => chooseImage("imageLink")}
                            >
                                <Block
                                >
                                    <Text caption center medium style={styles.label, { marginBottom: 5, textTransform: 'uppercase' }}>
                                        Vehicle Image
                            </Text>
                                    <Block style={{ marginBottom: 15 }}>
                                        <Image
                                            style={{ width: width - 200, height: width - 200 }}
                                            source={imageLink ? { uri: imageLink } : // if clicked a new img
                                                require('../assets/images/uploadimage.png')} //else show random
                                        />

                                    </Block>


                                </Block>

                            </TouchableWithoutFeedback>
                            <Input
                                full
                                maxLength={20}
                                label="Vehicle number"
                                style={{ marginBottom: 15 }}
                                value={vehicleNumber}
                                onChangeText={text => setVehicleNumber(text)}
                            />
                            <Block>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Vehicle Brand
                            </Text>
                                <DropDownPicker
                                    items={brandList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select brand"
                                    defaultValue={selectedBrand}
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 25 }}
                                    onChangeItem={item => {
                                        setSelectedBrand(item.value)
                                        //initdocument(item.value)
                                    }}
                                />
                            </Block>
                            <Block>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Vehicle Type
                            </Text>
                                <DropDownPicker
                                    items={vehicletypeList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select type"
                                    defaultValue={selectedVehicletype}
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 25 }}
                                    onChangeItem={item => {
                                        setSelectedVehicletype(item.value)
                                        //initdocument(item.value)
                                    }}
                                />
                            </Block>
                            <Input
                                full
                                maxLength={17}
                                label="Chassis number"
                                style={{ marginBottom: 15 }}
                                value={chassisNumber}
                                onChangeText={text => setChassisNumber(text)}
                            />
                            <Input
                                full
                                maxLength={12}
                                label="Engine number"
                                style={{ marginBottom: 15 }}
                                value={engineNumber}
                                onChangeText={text => setEngineNumber(text)}
                            />
                            <Input
                                full
                                maxLength={30}
                                label="Vehicle Model"
                                style={{ marginBottom: 15 }}
                                value={model}
                                onChangeText={text => setModel(text)}
                            />
                            <Input
                                full
                                maxLength={50}
                                label="Vehicle Origin"
                                style={{ marginBottom: 15 }}
                                value={origin}
                                onChangeText={text => setOrigin(text)}
                            />
                            <Input
                                full
                                number
                                maxLength={4}
                                label="Year Of Manufacture"
                                placeholder="yyyy"
                                style={{ marginBottom: 15 }}
                                value={yearOfManufacture}
                                onChangeText={text => setYearOfManufacture(text)}
                            />
                            <Input

                                number
                                label="Number of seats"
                                style={{ marginBottom: 15, width: width - 50 }}
                                value={seats}
                                onChangeText={text => setSeats(text)}
                            />
                            <Input
                                numeric
                                number
                                label="Distance Driven"
                                placeholder="...(km)"
                                style={{ marginBottom: 15, width: width - 50 }}
                                value={distanceDriven}
                                onChangeText={(newNum) => setDistanceDriven(newNum)}
                            />
                        </Block>

                    </Card>
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Vehicle Value">
                            <Block column center style={{ marginTop: 10 }}>
                                <Input
                                    full
                                    label="Contribute from"
                                    style={{ marginBottom: 15 }}
                                    value={startDate}
                                    onFocus={() => setIsStartDateVisible(true)}
                                />
                                <DateTimePickerModal
                                    isVisible={isStartDateVisible}
                                    mode="date"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setStartDate(`${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`)
                                        //console.log(departureTime)
                                        setIsStartDateVisible(false)
                                    }}
                                    onCancel={text => setIsStartDateVisible(false)}
                                />
                                <Input
                                    full
                                    label="Contribute to"
                                    style={{ marginBottom: 15 }}
                                    value={endDate}
                                    onFocus={() => setIsEndDateVisible(true)}
                                />
                                <DateTimePickerModal
                                    isVisible={isEndDateVisible}
                                    mode="date"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setEndDate(`${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`)
                                        //console.log(departureTime)
                                        setIsEndDateVisible(false)
                                    }}
                                    onCancel={text => setIsEndDateVisible(false)}
                                />
                                <Input
                                    full
                                    number
                                    label="Vehicle Value"
                                    placeholder="...(VND)"
                                    style={{ marginBottom: 15 }}
                                    value={value}
                                    onChangeText={text => setValue(text)}
                                />
                            </Block>
                        </Card>
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Vehicle Documents">
                            <Block column center style={{ marginTop: 10 }}>
                                <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
                                    setIsDocumentVisible(!isDocumentVisible)
                                    //initPassengerList()
                                }}>
                                    <Block row center>
                                        <Text color="white">
                                            + Add Vehicle Document
                            </Text>
                                    </Block>
                                </Button>
                                {vehicleDocumentList.length !== 0 ?
                                    (<Block row style={{ marginTop: 10, marginBottom: 15 }}>
                                        <FlatList
                                            data={vehicleDocumentList}
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
                                                            <Text h4 style={{ marginBottom: 15 }} color="brown">TYPE: {item["vehicleDocumentType"]}</Text>
                                                        </Block>
                                                        <Block row>
                                                            {renderImages(item, index)}
                                                            <Modal visible={showModal === index} transparent={true} onSwipeDown={() => setshowModal(-1)}>
                                                                {item["imageLinks"][1] === undefined ? item["imageLinks"][0] === undefined ? (<></>) :
                                                                    (<ImageViewer
                                                                        imageUrls={[{
                                                                            url: item["imageLinks"][0],

                                                                            props: {
                                                                            }
                                                                        }]}
                                                                        index={imageIndex}
                                                                        onSwipeDown={() => setshowModal(-1)}
                                                                        // onMove={data => console.log(data)}
                                                                        enableSwipeDown={true} />) :
                                                                    (<ImageViewer
                                                                        imageUrls={[{
                                                                            url: item["imageLinks"][0],

                                                                            props: {
                                                                            }
                                                                        }, {
                                                                            url: item["imageLinks"][1],

                                                                            props: {
                                                                            }
                                                                        }]}
                                                                        index={imageIndex}
                                                                        onSwipeDown={() => setshowModal(-1)}
                                                                        // onMove={data => console.log(data)}
                                                                        enableSwipeDown={true} />)}
                                                            </Modal>

                                                        </Block>
                                                        <Block row>
                                                            <Block column>
                                                                <Text style={{ marginLeft: 10 }} color="black3">Document number: {item["vehicleDocumentId"]}</Text>
                                                                <Text style={{ marginLeft: 10 }} color="black3">Registered Location: {item["registeredLocation"]}</Text>
                                                                <Text style={{ marginLeft: 10 }} color="black3">Registered Date: {item["registeredDate"]}</Text>
                                                                <Text style={{ marginLeft: 10 }} color="black3">Expiry Date: {item["expiryDate"]}</Text>
                                                            </Block>
                                                        </Block>
                                                    </Block>
                                                </TouchableWithoutFeedback>
                                            }
                                            keyExtractor={(item, index) => index.toString()} />
                                    </Block>) : (<Block row style={{ marginTop: 10, marginBottom: 15 }}>
                                        <Block column>
                                            <Block column style={styles.margin, { marginBottom: 10 }}>
                                                <Text style={{ marginLeft: 10 }} color="black3">Vehicle Document List not applied yet!!!</Text>
                                            </Block>
                                        </Block>
                                    </Block>)}
                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={isDocumentVisible}
                                    onRequestClose={() => {
                                        setIsDocumentVisible(!isDocumentVisible)
                                    }}
                                >
                                    <ScrollView style={styles.centeredView, { marginTop: 30 }}>
                                        <Card style={styles.margin} title="Create Document">
                                            <Block column style={{ marginBottom: 25 }}>
                                                <Input
                                                    maxLength={20}
                                                    label="Document ID"
                                                    style={{ marginBottom: 15, width: width - 100 }}
                                                    value={vehicleDocumentId}
                                                    onChangeText={text => setVehicleDocumentId(text)}
                                                />
                                                <Input
                                                    multiline={true}
                                                    maxLength={100}
                                                    label="Registered Location"
                                                    value={registeredLocation}
                                                    onChangeText={text => setRegisteredLocation(text)}
                                                    style={{ marginBottom: 15, height: 80, width: width - 100, textAlignVertical: "top" }}
                                                />
                                                <Block>
                                                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                                        Document type
                            </Text>
                                                    <DropDownPicker
                                                        items={vehicleDocumentTypeList}
                                                        defaultValue={vehicleDocumentType}
                                                        itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                                        placeholder="Select type"
                                                        containerStyle={{ height: 40, width: width - 100, marginBottom: 25 }}
                                                        onChangeItem={item => setVehicleDocumentType(item.value)}
                                                    />
                                                </Block>

                                                <Input
                                                    full
                                                    label="Registered date"
                                                    style={{ marginBottom: 15, width: width - 100 }}
                                                    value={registeredDate}
                                                    onFocus={() => setIsRegisteredDateVisible(true)}
                                                />
                                                <DateTimePickerModal
                                                    isVisible={isRegisteredDateVisible}
                                                    mode="date"
                                                    onConfirm={datetime => {
                                                        //console.log(datetime)
                                                        setRegisteredDate(`${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`)
                                                        //console.log(departureTime)
                                                        setIsRegisteredDateVisible(false)
                                                    }}
                                                    onCancel={text => setIsRegisteredDateVisible(false)}
                                                />
                                                <Input
                                                    full
                                                    label="Expiry date"
                                                    style={{ marginBottom: 15, width: width - 100 }}
                                                    value={expiryDate}
                                                    onFocus={() => setIsExpiryDateVisible(true)}
                                                />
                                                <DateTimePickerModal
                                                    isVisible={isExpiryDateVisible}
                                                    mode="date"
                                                    onConfirm={datetime => {
                                                        //console.log(datetime)
                                                        setExpiryDate(`${datetime.getFullYear()}-${datetime.getMonth() + 1}-${datetime.getDate()}`)
                                                        //console.log(departureTime)
                                                        setIsExpiryDateVisible(false)
                                                    }}
                                                    onCancel={text => setIsExpiryDateVisible(false)}
                                                />
                                                <TouchableWithoutFeedback
                                                    onPress={() => chooseImage("frontImgUri")}
                                                >
                                                    <Block
                                                    >
                                                        <Text caption medium style={styles.label, { marginBottom: 5, textTransform: 'uppercase' }}>
                                                            Front side
                            </Text>
                                                        <Block style={{ marginBottom: 15 }}>
                                                            <Image
                                                                style={{ width: width - 250, height: width - 250 }}
                                                                source={frontImgUri ? { uri: frontImgUri } : // if clicked a new img
                                                                    require('../assets/images/uploadimage.png')} //else show random
                                                            />

                                                        </Block>


                                                    </Block>

                                                </TouchableWithoutFeedback>
                                                <TouchableWithoutFeedback
                                                    onPress={() => chooseImage("backImgUri")}
                                                >
                                                    <Block
                                                    >
                                                        <Text caption medium style={styles.label, { marginBottom: 5, textTransform: 'uppercase' }}>
                                                            Back side
                            </Text>
                                                        <Block style={{ marginBottom: 15 }}>
                                                            <Image
                                                                style={{ width: width - 250, height: width - 250 }}
                                                                source={backImgUri ? { uri: backImgUri } : // if clicked a new img
                                                                    require('../assets/images/uploadimage.png')
                                                                }
                                                            />

                                                        </Block>


                                                    </Block>

                                                </TouchableWithoutFeedback>

                                                <Button full center style={styles.margin, { width: width - 100, marginBottom: 10, }} onPress={() => {
                                                    addVehiceDocument()
                                                    setIsDocumentVisible(!isDocumentVisible)
                                                }}>
                                                    <Block row center>
                                                        <Text color="white" >
                                                            Add Document
                                            </Text>
                                                    </Block>
                                                </Button>
                                                <Button center style={styles.margin, { width: width - 100 }} onPress={() => {
                                                    //resetVehicle()
                                                    resetVehicleDocument()
                                                }}>
                                                    <Block row center>
                                                        <Text color="white" >
                                                            Reset
                                            </Text>
                                                    </Block>
                                                </Button>

                                            </Block>
                                        </Card>
                                    </ScrollView>
                                </Modal>
                            </Block>
                        </Card>
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Request">
                            <Block column center style={{ marginTop: 10 }}>
                                <Input
                                    maxLength={100}
                                    multiline={true}
                                    full
                                    label="Description"
                                    value={description}
                                    onChangeText={text => setDescription(text)}
                                    style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                />
                                <Button full center style={styles.margin, { marginBottom: 10, width: width - 50 }} onPress={() => {
                                    //setIsDocumentVisible(!isDocumentVisible)
                                    //initPassengerList()
                                    createRequest()
                                }}>
                                    <Block row center>
                                        <Text color="white">
                                            Send Request
                            </Text>
                                    </Block>
                                </Button>
                                <Button center style={styles.margin, { marginBottom: 10, width: width - 50, marginHorizontal: 10 }} onPress={() => {
                                    resetVehicle()
                                    //resetVehicleDocument()
                                }}>
                                    <Block row center>
                                        <Text color="white" >
                                            Reset
                                            </Text>
                                    </Block>
                                </Button>
                            </Block>

                        </Card>
                    </>) : (requestType === 'WITHDRAW_VEHICLE' ? (
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Withdraw Vehicle">
                            <Block column center style={{ marginTop: 10 }}>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Vehicle ID
                            </Text>
                                <DropDownPicker
                                    items={vehicleList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select vehicle"
                                    defaultValue={selectedVehicle}
                                    containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                    onChangeItem={item => {
                                        setSelectedVehicle(item.value)
                                    }}
                                />
                                <Input
                                    multiline={true}
                                    full
                                    maxLength={100}
                                    label="Description"
                                    value={description}
                                    onChangeText={text => setDescription(text)}
                                    style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                />
                                <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
                                    //uploadImage(frontImgUri, requestType, user.uid)
                                    //console.log(vehicleList);
                                    withdrawRequest()
                                    //createRequest()
                                }}>
                                    <Block row center>
                                        <Text color="white" >
                                            Send Request
                                            </Text>
                                    </Block>
                                </Button>

                            </Block>

                        </Card>) : (<></>))}


            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
