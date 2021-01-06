import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import FirebaseRepository from '../repositories/FirebaseRepository';
import DriverRepository from "../repositories/DriverRepository";
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
    const [userDocumentNumber, setUserDocumentNumber] = useState('');
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
                inituserexisteddocument(user.uid);
                //setCheckDocumentTypes(["IDENTITY_CARD", "DRIVING_LICENSE"])
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
                            label: `${result[i]["userDocumentType"]}-${result[i]["userDocumentNumber"]}`,
                            value: result[i]["userDocumentNumber"]
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
                setUserDocumentId(JSON.stringify(response["userDocumentId"]))
                setUserDocumentNumber(id)
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

        //if (isfiled1err === false && isfiled2err === false && isfiled3err === false && isfiled4err === false && isfiled5err === false && isfiled5err2 === false && isfiled6err === false && isfiled7err === false && isfiled8err === false && isfiled9err === false) {
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
                userDocumentNumber: userDocumentNumber.trim(),
                userDocumentId: 0,
                userDocumentType: userDocumentType,
            }
        }
        await RequestRepository.createUserDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Close',
                            onPress: () => navigation.navigate("CreateRequest"),
                            style: 'cancel'
                        }
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
        clear()
        //}
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
                userDocumentNumber: userDocumentNumber,
                userDocumentId: userDocumentId,
                userDocumentType: userDocumentType,
            }
        }
        console.log(JSON.stringify(requests))
        await RequestRepository.createUserDocumentRequests(requests)
            .then((response) => {
                console.log(response.status)
                Alert.alert(
                    'Created',
                    'Request Created!!',
                    [
                        {
                            text: 'Close',
                            onPress: () => navigation.navigate("CreateRequest"),
                            style: 'cancel'
                        }
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
        clear()
        setIsLoading(false)
    }
    const clear = () => {
        setDescription('')
        setFrontImgUri('')
        setBackImgUri('')
        setUserDocumentType(documentTypes[0]["value"])
        setExpiryDate('')
        setUserDocumentNumber('')
        setUserDocumentId('')
        setRegisteredLocation(cityData[0]["value"])
        setRegisteredDate('')
        setOtherInformation(otherinfoData[0]["value"])
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
                userDocumentId: userDocumentId
            }
        }
        await RequestRepository.createUserDocumentRequests(requests)
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
                        }
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                Alert.alert(
                    'Error',
                    'deleteRequest:' + JSON.stringify(error["debugMessage"]),
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
    const changeVehicleRequest = async () => {
        setIsLoading(true)
        let requests = {
            description: description,
            requestType: requestType,
        }
        await RequestRepository.createChangeVehicleRequests(requests)
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
                        }
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
        clear()
        setIsLoading(false)
    }
    const [userdocumentList, setUserDocumentList] = useState([])
    const [documentTypes, setDocumentTypes] = useState([])
    const [checkdocumentTypes, setCheckDocumentTypes] = useState([])
    const [isfiled1err, setIsfiled1err] = useState(false)
    const [isfiled2err, setIsfiled2err] = useState(false)
    const [isfiled3err, setIsfiled3err] = useState(false)
    const [isfiled4err, setIsfiled4err] = useState(false)
    const [isfiled5err, setIsfiled5err] = useState(false)
    const [isfiled5err2, setIsfiled5err2] = useState(false)
    const [isfiled6err, setIsfiled6err] = useState(false)
    const [isfiled7err, setIsfiled7err] = useState(false)
    const [isfiled8err, setIsfiled8err] = useState(false)
    const [isfiled9err, setIsfiled9err] = useState(false)
    const [isfiled10err, setIsfiled10err] = useState(false)

    const [isfiled11err, setIsfiled11err] = useState(false)
    const [isfiled12err, setIsfiled12err] = useState(false)
    const [isfiled13err, setIsfiled13err] = useState(false)
    const [isfiled13err2, setIsfiled13err2] = useState(false)
    const [isfiled14err, setIsfiled14err] = useState(false)
    const [isfiled15err, setIsfiled15err] = useState(false)
    const [isfiled16err, setIsfiled16err] = useState(false)
    const [isfiled17err, setIsfiled17err] = useState(false)
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
    const [otherinfoData, setOtherinfoData] = useState([
        {
            label: "None",
            value: "None"
        },
        {
            label: "B2",
            value: "B2"
        },
        {
            label: "C",
            value: "C"
        },
        {
            label: "D",
            value: "D"
        },
        {
            label: "E",
            value: "E"
        },
        {
            label: "FE",
            value: "FE"
        },
        {
            label: "FB2",
            value: "FB2"
        },
        {
            label: "FC",
            value: "FD"
        },
    ])
    const inituserexisteddocument = async (userid) => {
        setCheckDocumentTypes([])
        setIsLoading(true);
        await DriverRepository.getDetailDriver(userid)
            .then((response) => {
                //console.log(response);
                //const result = Object.entries(response);
                //userDocumentId.in
                //setDriver(response["userDocumentList"][]);
                for (let i = 0; i < response["userDocumentList"].length; i++)
                    setCheckDocumentTypes(prevArray => [
                        ...prevArray, response["userDocumentList"][i]["userDocumentType"]
                    ])
            })
            .catch((error) => {
                console.log(error)
            })

        setIsLoading(false);
    }

    const validateCreateRequest = () => {
        var exDate = new Date(expiryDate.replace(/-/g, '/'));
        var regDate = new Date(registeredDate.replace(/-/g, '/'));
        userDocumentNumber.length < 9 || userDocumentNumber.length > 12 ? setIsfiled1err(true) : setIsfiled1err(false)
        registeredLocation.length < 1 || registeredLocation.length > 100 ? setIsfiled2err(true) : setIsfiled2err(false)
        userDocumentType === '' ? setIsfiled3err(true) : setIsfiled3err(false)
        checkdocumentTypes.indexOf(userDocumentType) > -1 ? setIsfiled10err(true) : setIsfiled10err(false)
        registeredDate === '' ? setIsfiled4err(true) : setIsfiled4err(false)
        expiryDate === '' ? setIsfiled5err(true) : setIsfiled5err(false)
        exDate < regDate ? setIsfiled5err2(true) : setIsfiled5err2(false)
        frontImgUri === '' ? setIsfiled6err(true) : setIsfiled6err(false)
        backImgUri === '' ? setIsfiled7err(true) : setIsfiled7err(false)
        //otherInformation.length < 1 || otherInformation.length > 50 ? setIsfiled8err(true) : setIsfiled8err(false)
        description.length < 1 || description.length > 100 ? setIsfiled9err(true) : setIsfiled9err(false)
        console.log(JSON.stringify(checkdocumentTypes))
    }
    const validateUpdateRequest = () => {
        var exDate = new Date(expiryDate.replace(/-/g, '/'));
        var regDate = new Date(registeredDate.replace(/-/g, '/'));
        registeredLocation.length < 1 || registeredLocation.length > 100 ? setIsfiled11err(true) : setIsfiled11err(false)
        registeredDate === '' ? setIsfiled12err(true) : setIsfiled12err(false)
        expiryDate === '' ? setIsfiled13err(true) : setIsfiled13err(false)
        exDate < regDate ? setIsfiled13err2(true) : setIsfiled13err2(false)
        frontImgUri === '' ? setIsfiled14err(true) : setIsfiled14err(false)
        backImgUri === '' ? setIsfiled15err(true) : setIsfiled15err(false)
        //otherInformation.length < 1 || otherInformation.length > 50 ? setIsfiled16err(true) : setIsfiled16err(false)
        description.length < 1 || description.length > 100 ? setIsfiled17err(true) : setIsfiled17err(false)

    }
    const checkUpdateRequest = () => {
        var exDate = new Date(expiryDate.replace(/-/g, '/'));
        var regDate = new Date(registeredDate.replace(/-/g, '/'));
        validateUpdateRequest()
        if (
            (registeredLocation.length >= 1 && registeredLocation.length <= 100) &&
            (registeredDate !== '') &&
            (expiryDate !== '') &&
            (exDate > regDate) &&
            (frontImgUri !== '') &&
            (backImgUri !== '') &&
            //(otherInformation.length >= 1 && otherInformation.length <= 50) &&
            (description.length >= 1 && description.length <= 100)) {
            updateRequest()
            // Alert.alert(
            //     'Error',
            //     'a',//JSON.stringify(error["debugMessage"]),
            //     [
            //         {
            //             text: 'Cancel',
            //             onPress: () => console.log('Cancel Pressed'),
            //             style: 'cancel'
            //         },
            //         { text: 'OK', onPress: () => console.log('OK Pressed') }
            //     ],
            //     { cancelable: false }
            // );
        }

    }
    const checkCreateRequest = () => {
        var exDate = new Date(expiryDate.replace(/-/g, '/'));
        var regDate = new Date(registeredDate.replace(/-/g, '/'));
        validateCreateRequest()
        if ((userDocumentNumber.length >= 9 && userDocumentNumber.length <= 12) &&
            (registeredLocation.length >= 1 && registeredLocation.length <= 100) &&
            (userDocumentType !== '') &&
            checkdocumentTypes.indexOf(userDocumentType) === -1 &&
            (registeredDate !== '') &&
            (expiryDate !== '') &&
            (exDate > regDate) &&
            (frontImgUri !== '') &&
            (backImgUri !== '') &&
            // (otherInformation.length >= 1 && otherInformation.length <= 50) &&
            (description.length >= 1 && description.length <= 100)) {
            createRequest()
            // Alert.alert(
            //     'Error',
            //     'a',//JSON.stringify(error["debugMessage"]),
            //     [
            //         {
            //             text: 'Cancel',
            //             onPress: () => console.log('Cancel Pressed'),
            //             style: 'cancel'
            //         },
            //         { text: 'OK', onPress: () => console.log('OK Pressed') }
            //     ],
            //     { cancelable: false }
            // );
        }

    }


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
                        onChangeItem={item => {
                            setRequestType(item.value);
                            clear()
                        }}
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
                                placeholder="9 - 12 characters..."
                                maxLength={20}
                                label="Document ID"
                                style={{ marginBottom: 15 }}
                                value={userDocumentNumber}
                                onChangeText={text => setUserDocumentNumber(text)}
                            />
                            {
                                isfiled1err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    ID need to be from 9 - 12 characters
                                </Text>) : (<></>)}
                            {/* <Input
                                multiline={true}
                                full
                                placeholder="1 - 100 characters..."
                                maxLength={100}
                                label="Registered Location"
                                value={registeredLocation}
                                onChangeText={text => setRegisteredLocation(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            /> */}
                            <Block>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                    Registered Location
                                </Text>
                                <DropDownPicker
                                    items={cityData}
                                    defaultValue={registeredLocation}
                                    itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select city"
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 15 }}
                                    onChangeItem={item => setRegisteredLocation(item.value)}
                                />
                                {
                                    isfiled2err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Must select Registered Location
                                    </Text>) : (<></>)}

                            </Block>

                            <Block>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                    Document type
                                </Text>
                                <DropDownPicker
                                    items={documentTypes}
                                    defaultValue={userDocumentType}
                                    itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select type"
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 15 }}
                                    onChangeItem={item => setUserDocumentType(item.value)}
                                />
                                {
                                    isfiled3err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Must select Document type
                                    </Text>) : (<></>)}
                                {
                                    isfiled10err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Document type already existed
                                    </Text>) : (<></>)}
                            </Block>

                            <Input
                                full
                                label="Registered date"
                                style={{ marginBottom: 15 }}
                                value={registeredDate}
                                onFocus={() => setIsRegisteredDateVisible(true)}
                            />
                            {
                                isfiled4err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Registered date must not be empty
                                </Text>) : (<></>)}
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
                            {
                                isfiled5err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Expiry date must not be empty
                                </Text>) : (<></>)}
                            {
                                isfiled5err2 ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Expiry date must not be sooner than Registered date
                                </Text>) : (<></>)}
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
                                        {
                                            isfiled6err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                Must not be empty
                                            </Text>) : (<></>)}
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
                                        {
                                            isfiled7err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                Must not be empty
                                            </Text>) : (<></>)}
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
                            {/* <Input
                                multiline={true}
                                placeholder="1 - 50 characters..."
                                full
                                maxLength={50}
                                label="Other information"
                                value={otherInformation}
                                onChangeText={text => setOtherInformation(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            />
                            {
                                isfiled8err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Other information must be from 1 - 50 characters
                                </Text>) : (<></>)} */}
                            {userDocumentType === "DRIVING_LICENSE" ? (<>
                                <Block>
                                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                        Other information (Class)
                                </Text>
                                    <DropDownPicker
                                        items={otherinfoData}
                                        defaultValue={otherInformation}
                                        itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                        placeholder="Select class"
                                        containerStyle={{ height: 40, width: width - 50, marginBottom: 15 }}
                                        onChangeItem={item => setOtherInformation(item.value)}
                                    />
                                    {
                                        isfiled8err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Must select class
                                        </Text>) : (<></>)}

                                </Block>
                            </>) : (<></>)}

                            <Input
                                multiline={true}
                                placeholder="1 - 100 characters..."
                                full
                                label="Description"
                                value={description}
                                onChangeText={text => setDescription(text)}
                                style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                            />
                            {
                                isfiled9err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Description must be from 1 - 100 characters
                                </Text>) : (<></>)}
                            <Block row>
                                <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                    //uploadImage(frontImgUri, requestType, user.uid)
                                    //console.log(registeredLocation);
                                    //createRequest()
                                    //validate()
                                    checkCreateRequest()

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
                                    containerStyle={{ height: 40, width: 250, marginBottom: 100 }}
                                    onChangeItem={item => { initdocument(item.value) }}
                                />
                                {selectedDocument !== '' ? (<>
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
                                            //console.log();
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
                                </>) : (<></>)}


                            </Block>

                        </Card>) : (requestType === 'UPDATE_DOCUMENT' ? (<Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Update User Document">
                            <Block column center style={{ marginTop: 10 }}>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Document to update
                            </Text>
                                <DropDownPicker
                                    items={userdocumentList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select document"
                                    defaultValue={selectedDocument}
                                    containerStyle={{ height: 40, width: 250, marginBottom: 80 }}
                                    onChangeItem={item => { initdocument(item.value) }}
                                />
                                {selectedDocument !== '' ? (<>
                                    <Input
                                        full
                                        editable={false}
                                        label="Document Number"
                                        maxLength={20}
                                        style={{ marginBottom: 15 }}
                                        value={userDocumentNumber}
                                        onChangeText={text => setUserDocumentNumber(text)}
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
                                    {
                                        isfiled11err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Registered Location need to be from 1 - 100 characters
                                        </Text>) : (<></>)}
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
                                    {
                                        isfiled12err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Registered date must not be empty
                                        </Text>) : (<></>)}
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
                                    {
                                        isfiled13err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Expiry date must not be empty
                                        </Text>) : (<></>)}
                                    {
                                        isfiled13err2 ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Expiry date must not be sooner than Registered date
                                        </Text>) : (<></>)}
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
                                                {
                                                    isfiled14err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Must not be empty
                                                    </Text>) : (<></>)}
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
                                                {
                                                    isfiled15err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Must not be empty
                                                    </Text>) : (<></>)}
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
                                    {userDocumentType === "DRIVING_LICENSE" ? (<>
                                        <Block>
                                            <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                                Document class
                                </Text>
                                            <DropDownPicker
                                                items={otherinfoData}
                                                defaultValue={otherInformation}
                                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                                placeholder="Select class"
                                                containerStyle={{ height: 40, width: width - 50, marginBottom: 15 }}
                                                onChangeItem={item => setOtherInformation(item.value)}
                                            />
                                            {
                                                isfiled16err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                    Must select class
                                                </Text>) : (<></>)}

                                        </Block>
                                    </>) : (<></>)}

                                    {/* <Input
                                        multiline={true}
                                        full
                                        maxLength={50}
                                        label="Other information"
                                        value={otherInformation}
                                        onChangeText={text => setOtherInformation(text)}
                                        style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                    />
                                    {
                                        isfiled16err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Other information must be from 1 - 50 characters
                                        </Text>) : (<></>)} */}
                                    <Input
                                        multiline={true}
                                        full
                                        label="Description"
                                        value={description}
                                        onChangeText={text => setDescription(text)}
                                        style={{ marginBottom: 25, height: 80, textAlignVertical: "top" }}
                                    />
                                    {
                                        isfiled17err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Description must be from 1 - 100 characters
                                        </Text>) : (<></>)}
                                    <Block row>
                                        <Button center style={styles.margin, { marginBottom: 10, width: width - 200, marginHorizontal: 10 }} onPress={() => {
                                            checkUpdateRequest()
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
                                </>) : (<></>)}



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
                                            changeVehicleRequest()
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
