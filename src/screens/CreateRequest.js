import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import FirebaseRepository from '../repositories/FirebaseRepository';
import VehicleRepository from "../repositories/VehicleRepository";
import RequestRepository from "../repositories/RequestRepository";
import DocumentRepository from "../repositories/DocumentRepository";

import { Alert, Dimensions, View, Modal, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, FlatList, AsyncStorage } from "react-native";
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
            padding: 0,
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
    const [userDocumentId, setUserDocumentId] = useState('');
    const [registeredLocation, setRegisteredLocation] = useState('');
    const [userDocumentType, setUserDocumentType] = useState('');
    const [registeredDate, setRegisteredDate] = useState('');
    const [otherInformation, setOtherInformation] = useState('');
    const [isRegisteredDateVisible, setIsRegisteredDateVisible] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [isExpiryDateVisible, setIsExpiryDateVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [frontImgId, setFrontImgId] = useState('');
    const [backImgId, setBackImgId] = useState('');
    const [isfrontImgUpdate, setIsfrontImgUpdate] = useState(false);
    const [isbackImgUpdate, setIsbackImgUpdate] = useState(false);
    useEffect(() => {
        //setIsLoading(true);
        getCurrentUser()
            .then((user) => {
                setUser(user);
                setUserDocumentList([])
                setDocumentTypes([])
                inituserdocument(user.uid);
                inituserdocumenttype();


            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });
    }, [isFocused]);
    const chooseImage = (image) => {
        let options = {
            title: 'Select Avatar',
            cameraType: 'front',
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'Images',
            },
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
                    (setFrontImgUri(response.uri),
                        setIsfrontImgUpdate(true)
                        //SetFrontImg64(response.data)
                        //console.log(response.data)
                    )
                    : (setBackImgUri(response.uri),
                        setIsbackImgUpdate(true))
            }
        });
    }
    const [driver, setDriver] = useState({})
    const inituserdocument = async (uid) => {
        setIsLoading(true)
        await DocumentRepository.getUserDocument(uid)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setUserDocumentList(prevArray => [
                        ...prevArray, {
                            label: `${result[i]["userDocumentType"]}-${result[i]["userDocumentId"]}`,
                            value: result[i]["userDocumentId"]
                        }
                    ])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const initdocument = async (id) => {
        setIsLoading(true)
        setSelectedDocument(id)
        await DocumentRepository.getUserDetailDocument(id)
            .then((response) => {
                //console.log(response);
                //const result = Object.values(response);
                //console.log(result);
                setFrontImgUri(response["userDocumentImages"][0]["imageLink"])
                setFrontImgId(response["userDocumentImages"][0]["userDocumentImageId"])
                setBackImgUri(response["userDocumentImages"][1]["imageLink"])
                setBackImgId(response["userDocumentImages"][1]["userDocumentImageId"])
                setUserDocumentType(response["userDocumentType"])
                setExpiryDate(response["expiryDate"])
                setUserDocumentId(id)
                setRegisteredLocation(response["registeredLocation"])
                setRegisteredDate(response["registeredDate"])
                setOtherInformation(response["otherInformation"])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const inituserdocumenttype = async () => {
        setIsLoading(true)
        await DocumentRepository.getUserDocumentType()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setDocumentTypes(prevArray => [
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
    const createRequest = async () => {
        setIsLoading(true)
        let urlf = await FirebaseRepository.uploadImageToFirebase(frontImgUri, requestType + "_FRONT", user.uid)
        let urlb = await FirebaseRepository.uploadImageToFirebase(backImgUri, requestType + "_BACK", user.uid)
        let requests = {
            description: description.trim(),
            requestType: requestType,
            userDocumentReq: {
                expiryDate: expiryDate,
                otherInformation: otherInformation.trim(),
                userDocumentImages: [
                    // frontImgLink,
                    // backImgLink
                    { imageLink: urlf }, { imageLink: urlb }

                    //"a", "b"
                ],
                registeredDate: registeredDate,
                registeredLocation: registeredLocation.trim(),
                userDocumentId: userDocumentId.trim(),
                userDocumentType: userDocumentType,
            }
        }
        RequestRepository.createUserDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Back to menu',
                            onPress: () => navigation.navigate("Service")
                        },
                        {
                            text: 'Reset',
                            onPress: () => navigation.navigate("Requests"),
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
        clear()
        setIsLoading(false)
    }
    const updateRequest = async () => {
        setIsLoading(true)
        let urlf = ''
        let urlb = ''
        isfrontImgUpdate === true ? (urlf = await FirebaseRepository.uploadImageToFirebase(frontImgUri, requestType + "_FRONT", user.uid)) : (urlf = frontImgUri)
        isbackImgUpdate === true ? (urlb = await FirebaseRepository.uploadImageToFirebase(backImgUri, requestType + "_BACK", user.uid)) : (urlb = backImgUri)
        let requests = {
            description: description.trim(),
            requestType: requestType,
            userDocumentReq: {
                expiryDate: expiryDate,
                otherInformation: otherInformation.trim(),
                userDocumentImages: [
                    // frontImgLink,
                    // backImgLink
                    {
                        imageLink: urlf,
                        userDocumentImageId: frontImgId
                    },
                    {
                        imageLink: urlb,
                        userDocumentImageId: backImgId
                    }

                    //"a", "b"
                ],
                registeredDate: registeredDate,
                registeredLocation: registeredLocation.trim(),
                userDocumentId: userDocumentId,
                userDocumentType: userDocumentType,
            }
        }
        console.log(JSON.stringify(requests))
        RequestRepository.createUserDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Back to menu',
                            onPress: () => navigation.navigate("Service")
                        },
                        {
                            text: 'Reset',
                            onPress: () => navigation.navigate("Requests"),
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
        clear()
        setIsLoading(false)
    }
    const clear = () => {
        setDescription('')
        setFrontImgUri('')
        setBackImgUri('')
        setUserDocumentType(documentTypes[0]["value"])
        setExpiryDate('')
        setUserDocumentId('')
        setRegisteredLocation('')
        setRegisteredDate('')
        setOtherInformation('')
        setFrontImgId('')
        setBackImgId('')
        setIsfrontImgUpdate(false)
        setIsbackImgUpdate(false)
    }
    const deleteRequest = async () => {
        setIsLoading(true)
        let requests = {
            description: description.trim(),
            requestType: requestType,
            userDocumentReq: {
                userDocumentId: selectedDocument
            }
        }
        RequestRepository.createUserDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Sent',
                    'Request Created!!',
                    [
                        {
                            text: 'Close',
                            onPress: () => navigation.navigate("CreateRequest"),
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
        clear()
        setIsLoading(false)
    }
    const chnageVehicleRequest = async () => {
        setIsLoading(true)
        let requests = {
            description: description,
            requestType: requestType,
        }
        RequestRepository.createChangeVehicleRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Sent',
                    'Request Created!!',
                    [
                        {
                            text: 'Close',
                            onPress: () => navigation.navigate("CreateRequest"),
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
        clear()
        setIsLoading(false)
    }
    const [userdocumentList, setUserDocumentList] = useState([])
    const [documentTypes, setDocumentTypes] = useState([])

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Driver Request" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 10, }} title="Driver Request">
                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                        Request type
                            </Text>
                    <DropDownPicker
                        items={[
                            { label: 'Create User Document', value: 'NEW_DOCUMENT' },
                            { label: 'Update User Document', value: 'UPDATE_DOCUMENT' },
                            { label: 'Delete User Document', value: 'DELETE_DOCUMENT' },
                            { label: 'Change Vehicle', value: 'CHANGE_VEHICLE' },
                        ]}
                        defaultValue={requestType}
                        //dropDownMaxHeight={300}
                        itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                        placeholder="Select type"
                        containerStyle={{ height: 40, width: 250, marginBottom: 100 }}
                        onChangeItem={item => setRequestType(item.value)}
                    />
                    {/* <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                        Vehicle ID
                            </Text>
                    <DropDownPicker
                        items={userdocumentList}
                        //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                        placeholder="Select vehicle"
                        defaultValue={selectedVehicle}
                        containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                        onChangeItem={item => {
                            setSelectedVehicle(item.value)
                            initdocument(item.value)
                        }}
                    /> */}
                </Card>
                {requestType === 'NEW_DOCUMENT' ?
                    (<Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="New User Document">
                        <Block column center style={{ marginTop: 10 }}>
                            <Input
                                full

                                maxLength={20}
                                label="Document ID"
                                style={{ marginBottom: 15 }}
                                value={userDocumentId}
                                onChangeText={text => setUserDocumentId(text)}
                            />
                            <Input
                                multiline={true}
                                full
                                maxLength={100}
                                label="Registered Location"
                                value={registeredLocation}
                                onChangeText={text => setRegisteredLocation(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            />
                            <Block>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                    Document type
                            </Text>
                                <DropDownPicker
                                    items={documentTypes}
                                    defaultValue={userDocumentType}
                                    itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select type"
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 25 }}
                                    onChangeItem={item => setUserDocumentType(item.value)}
                                />
                            </Block>

                            <Input
                                full
                                label="Registered date"
                                style={{ marginBottom: 15 }}
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
                                style={{ marginBottom: 15 }}
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
                            <Block row>
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
                                                style={{ width: width - 200, height: width - 200 }}
                                                source={frontImgUri ? { uri: frontImgUri } : // if clicked a new img
                                                    require('../assets/images/uploadimage.png')} //else show random
                                            />

                                        </Block>


                                    </Block>

                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback
                                    // onPress={() => navigation.navigate("Assigned Driver")}
                                    //style={styles.activeBorder}
                                    onPress={() => chooseImage("backImgUri")}
                                >
                                    <Block
                                    //style={[
                                    //    styles.card,
                                    //     styles.active
                                    //]}
                                    >
                                        <Text caption medium style={styles.label, { marginBottom: 5, textTransform: 'uppercase' }}>
                                            Back side
                            </Text>
                                        <Block style={{ marginBottom: 15 }}>
                                            <Image
                                                style={{ width: width - 200, height: width - 200 }}
                                                source={backImgUri ? { uri: backImgUri } : // if clicked a new img
                                                    require('../assets/images/uploadimage.png')
                                                } //else show random
                                            />

                                        </Block>


                                    </Block>

                                </TouchableWithoutFeedback>

                            </Block>
                            <Input
                                multiline={true}
                                full
                                maxLength={50}
                                label="Other information"
                                value={otherInformation}
                                onChangeText={text => setOtherInformation(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            />
                            <Input
                                multiline={true}
                                full
                                label="Description"
                                value={description}
                                onChangeText={text => setDescription(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            />
                            <Block row>
                                <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                    //uploadImage(frontImgUri, requestType, user.uid)
                                    //console.log(vehicleList);
                                    createRequest()
                                    //createRequest()
                                }}>
                                    <Block row center>
                                        <Text color="white" >
                                            Send Request
                                            </Text>
                                    </Block>
                                </Button>
                                <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                    //uploadImage(frontImgUri, requestType, user.uid)
                                    //console.log(vehicleList);
                                    clear()
                                    //createRequest()
                                }}>
                                    <Block row center>
                                        <Text color="white" >
                                            Reset
                                            </Text>
                                    </Block>
                                </Button>
                            </Block>

                        </Block>

                    </Card>) : (requestType === 'DELETE_DOCUMENT' ? (
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Delete Document">
                            <Block column center style={{ marginTop: 10 }}>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Document to delete
                            </Text>
                                <DropDownPicker
                                    items={userdocumentList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select document"
                                    defaultValue={selectedDocument}
                                    containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                    onChangeItem={item => setSelectedDocument(item.value)}
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
                                <Block row>
                                    <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                        //uploadImage(frontImgUri, requestType, user.uid)
                                        //console.log(vehicleList);
                                        deleteRequest()
                                        //createRequest()
                                    }}>
                                        <Block row center>
                                            <Text color="white" >
                                                Send Request
                                            </Text>
                                        </Block>
                                    </Button>
                                    <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                        //uploadImage(frontImgUri, requestType, user.uid)
                                        //console.log(vehicleList);
                                        clear()
                                        //createRequest()
                                    }}>
                                        <Block row center>
                                            <Text color="white" >
                                                Reset
                                            </Text>
                                        </Block>
                                    </Button>
                                </Block>

                            </Block>

                        </Card>) : (requestType === 'UPDATE_DOCUMENT' ? (<Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="New User Document">
                            <Block column center style={{ marginTop: 10 }}>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Document to update
                            </Text>
                                <DropDownPicker
                                    items={userdocumentList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select document"
                                    defaultValue={selectedDocument}
                                    containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                    onChangeItem={item => { initdocument(item.value) }}
                                />
                                <Input
                                    full
                                    editable={false}
                                    label="Document ID"
                                    maxLength={20}
                                    style={{ marginBottom: 15 }}
                                    value={userDocumentId}
                                    onChangeText={text => setUserDocumentId(text)}
                                />
                                <Input
                                    multiline={true}
                                    full
                                    maxLength={100}
                                    label="Registered Location"
                                    value={registeredLocation}
                                    onChangeText={text => setRegisteredLocation(text)}
                                    style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                />
                                <Block>
                                    {/*
                                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                        Document type
                            </Text>
                                     <DropDownPicker
                                        items={documentTypes}
                                        defaultValue={userDocumentType}
                                        itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                        placeholder="Select type"
                                        containerStyle={{ height: 40, width: width - 50, marginBottom: 25 }}
                                        onChangeItem={item => setUserDocumentType(item.value)}
                                    /> */}
                                    <Input
                                        full
                                        editable={false}
                                        label="Document type"
                                        style={{ marginBottom: 15 }}
                                        value={userDocumentType}
                                    //onFocus={() => setIsRegisteredDateVisible(true)}
                                    />
                                </Block>

                                <Input
                                    full

                                    label="Registered date"
                                    style={{ marginBottom: 15 }}
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
                                    style={{ marginBottom: 15 }}
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
                                <Block row>
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
                                                    style={{ width: width - 200, height: width - 200 }}
                                                    source={frontImgUri ? { uri: frontImgUri } : // if clicked a new img
                                                        require('../assets/images/uploadimage.png')} //else show random
                                                />

                                            </Block>


                                        </Block>

                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        // onPress={() => navigation.navigate("Assigned Driver")}
                                        //style={styles.activeBorder}
                                        onPress={() => chooseImage("backImgUri")}
                                    >
                                        <Block
                                        //style={[
                                        //    styles.card,
                                        //     styles.active
                                        //]}
                                        >
                                            <Text caption medium style={styles.label, { marginBottom: 5, textTransform: 'uppercase' }}>
                                                Back side
                            </Text>
                                            <Block style={{ marginBottom: 15 }}>
                                                <Image
                                                    style={{ width: width - 200, height: width - 200 }}
                                                    source={backImgUri ? { uri: backImgUri } : // if clicked a new img
                                                        require('../assets/images/uploadimage.png')
                                                    } //else show random
                                                />

                                            </Block>


                                        </Block>

                                    </TouchableWithoutFeedback>

                                </Block>
                                <Input
                                    multiline={true}
                                    full
                                    maxLength={50}
                                    label="Other information"
                                    value={otherInformation}
                                    onChangeText={text => setOtherInformation(text)}
                                    style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                />
                                <Input
                                    multiline={true}
                                    full
                                    label="Description"
                                    value={description}
                                    onChangeText={text => setDescription(text)}
                                    style={{ marginBottom: 25, height: 80, textAlignVertical: "top" }}
                                />
                                <Block row>
                                    <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                        updateRequest()
                                    }}>
                                        <Block row center>
                                            <Text color="white" >
                                                Send Request
                                            </Text>
                                        </Block>
                                    </Button>
                                    <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                        clear()
                                    }}>
                                        <Block row center>
                                            <Text color="white" >
                                                Reset
                                            </Text>
                                        </Block>
                                    </Button>
                                </Block>


                            </Block>

                        </Card>) : (requestType === 'CHANGE_VEHICLE' ? (
                            <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Change Vehicle">
                                <Block column center style={{ marginTop: 10 }}>
                                    <Input
                                        multiline={true}
                                        full
                                        maxLength={100}
                                        label="Description"
                                        value={description}
                                        onChangeText={text => setDescription(text)}
                                        style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                    />
                                    <Block row>
                                        <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                            //uploadImage(frontImgUri, requestType, user.uid)
                                            //console.log(vehicleList);
                                            chnageVehicleRequest()
                                            //createRequest()
                                        }}>
                                            <Block row center>
                                                <Text color="white" >
                                                    Send Request
                                            </Text>
                                            </Block>
                                        </Button>
                                        <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                            //uploadImage(frontImgUri, requestType, user.uid)
                                            //console.log(vehicleList);
                                            clear()
                                            //createRequest()
                                        }}>
                                            <Block row center>
                                                <Text color="white" >
                                                    Reset
                                            </Text>
                                            </Block>
                                        </Button>
                                    </Block>

                                </Block>

                            </Card>) : (<></>))))}


            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
