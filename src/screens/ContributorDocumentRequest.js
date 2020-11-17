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
    const [frontImgLink, setFrontImgLink] = useState('');
    const [backImgUri, setBackImgUri] = useState('');
    const [backImgLink, setBackImgLink] = useState('');
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
    const [documentList, SetDocumentList] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState('');
    useEffect(() => {
        //setIsLoading(true);
        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                initvehicle(user.uid);
                //console.log(Profile_Image);
                //setIsLoading(false);

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
                    (setFrontImgUri(response.uri)
                        //SetFrontImg64(response.data)
                        //console.log(response.data)
                    )
                    : (setBackImgUri(response.uri))
            }
        });
    }
    const [driver, setDriver] = useState({})
    const initvehicle = (uid) => {
        VehicleRepository.getVehicle(`?ownerId=${uid}`)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.vehicleList);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setVehicleList(prevArray => [
                        ...prevArray, {
                            label: result[i]["vehicleId"],
                            value: result[i]["vehicleId"]
                        }
                    ])
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const initdocument = (uid) => {
        DocumentRepository.getVehicleDocument(`?vehicleId=${uid}&viewOption=0`)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.vehicleDocuments);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    SetDocumentList(prevArray => [
                        ...prevArray, {
                            label: result[i]["vehicleDocumentId"],
                            value: result[i]["vehicleDocumentId"]
                        }

                    ])
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const createRequest = async () => {
        let urlf = await FirebaseRepository.uploadImageToFirebase(frontImgUri, requestType + "_FRONT", user.uid)
        let urlb = await FirebaseRepository.uploadImageToFirebase(backImgUri, requestType + "_BACK", user.uid)
        let requests = {
            description: description,
            requestType: requestType,
            vehicleDocument: {
                vehicleDocumentReq: {
                    expiryDate: expiryDate,
                    imageLinks: [
                        // frontImgLink,
                        // backImgLink
                        urlf,
                        urlb
                        //"a", "b"
                    ],
                    registeredDate: registeredDate,
                    registeredLocation: registeredLocation,
                    vehicleDocumentId: vehicleDocumentId,
                    vehicleDocumentType: vehicleDocumentType,
                },
                vehicleId: selectedVehicle
            }
        }
        RequestRepository.createVehicleDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Back to menu',
                            onPress: () => navigation.navigate("RequestType")
                        },
                        {
                            text: 'Reset',
                            onPress: () => navigation.navigate("DocumentRequest"),
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
        //console.log("done");


    }
    const deleteRequest = async () => {
        let requests = {
            description: description,
            requestType: requestType,
            vehicleDocument: {
                vehicleDocumentReq: {
                    vehicleDocumentId: selectedDocument,
                },
                vehicleId: selectedVehicle
            }
        }
        RequestRepository.createVehicleDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Sent',
                    'Request Created!!',
                    [
                        {
                            text: 'Back to menu',
                            onPress: () => navigation.navigate("RequestType")
                        },
                        {
                            text: 'Reset',
                            onPress: () => navigation.navigate("DocumentRequest"),
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
        //console.log("done");


    }
    const [vehicleList, setVehicleList] = useState([])

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Document Request" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Document Request">
                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                        Request type
                            </Text>
                    <DropDownPicker
                        items={[
                            { label: 'Create Document', value: 'NEW_VEHICLE_DOCUMENT' },
                            { label: 'Delete Document', value: 'DELETE_VEHICLE_DOCUMENT' },
                        ]}
                        defaultValue={requestType}
                        //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                        placeholder="Select type"
                        containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                        onChangeItem={item => setRequestType(item.value)}
                    />
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
                            initdocument(item.value)
                        }}
                    />

                </Card>
                {requestType === 'NEW_VEHICLE_DOCUMENT' && selectedVehicle !== '' ?
                    (<Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="New Vehicle Document">
                        <Block column center style={{ marginTop: 10 }}>
                            <Input
                                full
                                label="Document ID"
                                style={{ marginBottom: 15 }}
                                value={vehicleDocumentId}
                                onChangeText={text => setVehicleDocumentId(text)}
                            />
                            <Input
                                multiline={true}
                                full
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
                                    items={[
                                        { label: 'VEHICLE REGISTRATION CERTIFICATE', value: 'VEHICLE_REGISTRATION_CERTIFICATE' },
                                        { label: 'CIVIL LIABILITY INSURANCE CERTIFICATE', value: 'CIVIL_LIABILITY_INSURANCE_CERTIFICATE' },
                                    ]}
                                    defaultValue={vehicleDocumentType}
                                    itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select type"
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 25 }}
                                    onChangeItem={item => setVehicleDocumentType(item.value)}
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
                                    setRegisteredDate(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}`)
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
                                    setExpiryDate(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}`)
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
                                label="Description"
                                value={description}
                                onChangeText={text => setDescription(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            />
                            <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
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

                        </Block>

                    </Card>) : (requestType === 'DELETE_VEHICLE_DOCUMENT' && selectedVehicle !== '' ? (
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Delete Document">
                            <Block column center style={{ marginTop: 10 }}>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Document to delete
                            </Text>
                                <DropDownPicker
                                    items={documentList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select document"
                                    defaultValue={selectedDocument}
                                    containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                    onChangeItem={item => setSelectedDocument(item.value)}
                                />
                                <Input
                                    multiline={true}
                                    full
                                    label="Description"
                                    value={description}
                                    onChangeText={text => setDescription(text)}
                                    style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                />
                                <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
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

                            </Block>

                        </Card>) : (<></>))}


            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;