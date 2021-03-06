import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import FirebaseRepository from '../repositories/FirebaseRepository';
import VehicleRepository from "../repositories/VehicleRepository";
import RequestRepository from "../repositories/RequestRepository";
import DocumentRepository from "../repositories/DocumentRepository";

import { View, Alert, Dimensions, Modal, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, FlatList, AsyncStorage } from "react-native";
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
import ModalCountryPicker from "../components/ModalCountryPicker";

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
    const [seatList, setSeatList] = useState([]);
    const [vehicleDocumentTypeList, setVehicleDocumentTypeList] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(1);
    const [vehicletypeList, setVehicleTypeList] = useState([]);
    const [selectedVehicletype, setSelectedVehicletype] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [chassisNumber, setChassisNumber] = useState('');
    const [distanceDriven, setDistanceDriven] = useState('');
    const [engineNumber, setEngineNumber] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [model, setModel] = useState('');
    const [origin, setOrigin] = useState('');
    const [seats, setSeats] = useState('');
    const [yearOfManufacture, setYearOfManufacture] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleList, setVehicleList] = useState([]);
    const [vehicleDocumentList, setVehicleDocumentList] = useState([]);
    const [showModal, setshowModal] = useState(-1);
    const [imageIndex, setimageIndex] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [value, setValue] = useState('');
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
                initseats();
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
    const initseats = async () => {
        setIsLoading(true)
        await VehicleRepository.getVehicleSeats()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setSeatList(prevArray => [
                        ...prevArray, {
                            label: JSON.stringify(result[i]["seats"]),
                            value: result[i]["seatsId"]
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
                ],
                registeredDate: registeredDate,
                registeredLocation: registeredLocation.trim(),
                vehicleDocumentId: 0,
                vehicleDocumentNumber: vehicleDocumentId.trim(),
                vehicleDocumentType: vehicleDocumentType,
            }
        ])
        setExisteddoclist(prevArray => [
            ...prevArray,
            vehicleDocumentType
        ])
        resetVehicleDocument()
        setIsLoading(false)
    }
    const resetVehicleDocument = () => {
        setExpiryDate('')
        setFrontImgUri('')
        setBackImgUri('')
        setRegisteredDate('')
        setRegisteredLocation(cityData[0]["value"])
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
        setSeats(seatList[0]["value"])
        setDistanceDriven('')
        setDescription('')
        setStartDate('')
        setEndDate('')
        setValue('')
        setVehicleDocumentList([])
        setExisteddoclist([])
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
                seatsId: parseInt(seats),
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
        console.log("done");
        resetVehicle()
        setIsLoading(false)

    }

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
    const [isfiled14err, setIsfiled14err] = useState(false)
    const [isfiled15err, setIsfiled15err] = useState(false)
    const [isfiled16err, setIsfiled16err] = useState(false)

    const [isfiled17err, setIsfiled17err] = useState(false)
    const [isfiled18err, setIsfiled18err] = useState(false)
    const [isfiled19err, setIsfiled19err] = useState(false)
    const [isfiled20err, setIsfiled20err] = useState(false)
    const [isfiled21err, setIsfiled21err] = useState(false)
    const [isfiled22err, setIsfiled22err] = useState(false)
    const [isfiled23err, setIsfiled23err] = useState(false)
    const [isfiled24err, setIsfiled24err] = useState(false)
    const [isfiled25err, setIsfiled25err] = useState(false)
    const [isfiled26err, setIsfiled26err] = useState(false)

    const [existeddoclist, setExisteddoclist] = useState([])
    const [visibleCountryPicker, setVisibleCountryPicker] = useState(false)
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
    const validateCreateRequest = () => {
        const licensePlateRegex = new RegExp(/^[1-9]{1}[0-9][A-Z]{1}-[0-9]{3}([0-9]{1}|(.[0-9]{2}))$/);
        var fromDate = new Date(startDate.replace(/-/g, '/'));
        var toDate = new Date(endDate.replace(/-/g, '/'));
        imageLink === '' ? setIsfiled1err(true) : setIsfiled1err(false)
        !licensePlateRegex.test(vehicleNumber) ? setIsfiled2err(true) : setIsfiled2err(false)
        selectedBrand === '' ? setIsfiled3err(true) : setIsfiled3err(false)
        selectedVehicletype === '' ? setIsfiled4err(true) : setIsfiled4err(false)
        chassisNumber.length !== 17 ? setIsfiled5err(true) : setIsfiled5err(false)
        engineNumber.length !== 12 ? setIsfiled6err(true) : setIsfiled6err(false)
        model.length < 1 || model.length > 30 ? setIsfiled7err(true) : setIsfiled7err(false)
        origin === '' ? setIsfiled8err(true) : setIsfiled8err(false)
        JSON.stringify(yearOfManufacture).length !== 6 ? setIsfiled9err(true) : setIsfiled9err(false)
        seats === '' ? setIsfiled10err(true) : setIsfiled10err(false)
        distanceDriven === '' ? setIsfiled11err(true) : setIsfiled11err(false)
        startDate === '' ? setIsfiled12err(true) : setIsfiled12err(false)
        endDate === '' ? setIsfiled13err(true) : setIsfiled13err(false)
        fromDate > toDate ? setIsfiled14err(true) : setIsfiled14err(false)
        value === '' ? setIsfiled15err(true) : setIsfiled15err(false)
        description.length < 1 || description.length > 100 ? setIsfiled16err(true) : setIsfiled16err(false)
        //vehicleDocumentList.length !== 2 ? setIsfiled26err(true) : setIsfiled26err(false)
    }
    const validateCreateDocument = () => {
        var fromDate = new Date(registeredDate.replace(/-/g, '/'));
        var toDate = new Date(expiryDate.replace(/-/g, '/'));
        vehicleDocumentId.length < 9 || vehicleDocumentId.length > 12 ? setIsfiled17err(true) : setIsfiled17err(false)
        registeredLocation === '' ? setIsfiled18err(true) : setIsfiled18err(false)
        vehicleDocumentType === '' ? setIsfiled19err(true) : setIsfiled19err(false)
        registeredDate === '' ? setIsfiled20err(true) : setIsfiled20err(false)
        expiryDate === '' ? setIsfiled21err(true) : setIsfiled21err(false)
        toDate < fromDate ? setIsfiled22err(true) : setIsfiled22err(false)
        frontImgUri === '' ? setIsfiled23err(true) : setIsfiled23err(false)
        backImgUri === '' ? setIsfiled24err(true) : setIsfiled24err(false)
        existeddoclist.indexOf(vehicleDocumentType) > -1 ? setIsfiled25err(true) : setIsfiled25err(false)

    }
    const checkCreateRequest = () => {
        const licensePlateRegex = new RegExp(/^[1-9]{1}[0-9][A-Z]{1}-[0-9]{3}([0-9]{1}|(.[0-9]{2}))$/);
        var fromDate = new Date(startDate.replace(/-/g, '/'));
        var toDate = new Date(endDate.replace(/-/g, '/'));
        validateCreateRequest()
        if ((imageLink !== '') &&
            (licensePlateRegex.test(vehicleNumber)) &&
            (selectedBrand !== '') &&
            (selectedVehicletype !== '') &&
            (chassisNumber.length === 17) &&
            (engineNumber.length === 12) &&
            (model.length >= 1 && model.length <= 30) &&
            (origin !== '') &&
            (JSON.stringify(yearOfManufacture).length === 6) &&
            (seats !== '') &&
            (distanceDriven !== '') &&
            (startDate !== '') &&
            (endDate !== '') &&
            (fromDate <= toDate) &&
            (value !== '') &&
            (description.length >= 1 && description.length <= 100)
            //(vehicleDocumentList.length === 2)
        ) {
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
    const checkCreateDocument = () => {
        var fromDate = new Date(registeredDate.replace(/-/g, '/'));
        var toDate = new Date(expiryDate.replace(/-/g, '/'));
        validateCreateDocument()
        console.log(JSON.stringify(existeddoclist))
        if ((vehicleDocumentId.length >= 9 && vehicleDocumentId.length <= 12) &&
            (registeredLocation !== '') &&
            (selectedBrand !== '') &&
            (vehicleDocumentType !== '') &&
            (registeredDate !== '') &&
            (expiryDate !== '') &&
            (fromDate <= toDate) &&
            (frontImgUri !== '') &&
            (backImgUri !== '') &&
            (existeddoclist.indexOf(vehicleDocumentType) === -1)
        ) {
            addVehiceDocument()
            setIsDocumentVisible(!isDocumentVisible)
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
                        containerStyle={{ height: 40, width: 250, marginBottom: 60 }}
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
                                    {
                                        isfiled1err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                            Must not be empty
                                        </Text>) : (<></>)}
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
                                placeholder="ex: 93D-121.11"
                                label="License plate number"
                                style={{ marginBottom: 15 }}
                                value={vehicleNumber}
                                onChangeText={text => setVehicleNumber(text)}
                            />
                            {
                                isfiled2err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Wrong format License plate number (ex: 93D-121.11)
                                </Text>) : (<></>)}
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
                                {
                                    isfiled3err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Must select Vehicle Brand
                                    </Text>) : (<></>)}
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
                                {
                                    isfiled4err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Must select Vehicle Type
                                    </Text>) : (<></>)}
                            </Block>
                            <Input
                                full
                                maxLength={17}
                                placeholder="17 characters"
                                label="Chassis number/VIN"
                                style={{ marginBottom: 15 }}
                                value={chassisNumber}
                                onChangeText={text => setChassisNumber(text)}
                            />
                            {
                                isfiled5err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Chassis number/VIN must be 17 characters
                                </Text>) : (<></>)}
                            <Input
                                full
                                maxLength={12}
                                placeholder="12 characters"
                                label="Engine number"
                                style={{ marginBottom: 15 }}
                                value={engineNumber}
                                onChangeText={text => setEngineNumber(text)}
                            />
                            {
                                isfiled6err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Engine number must be 12 characters
                                </Text>) : (<></>)}
                            <Input
                                full
                                maxLength={30}
                                placeholder="1 - 30 characters"
                                label="Vehicle Model"
                                style={{ marginBottom: 15 }}
                                value={model}
                                onChangeText={text => setModel(text)}
                            />
                            {
                                isfiled7err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Vehicle Model need to be from 1 to 30 characters
                                </Text>) : (<></>)}
                            <Input
                                full
                                maxLength={50}
                                label="Vehicle Origin"
                                //style={{ marginBottom: 5 }}
                                value={origin}
                                //onChangeText={text => setOrigin(text)}
                                onFocus={() => setVisibleCountryPicker(true)}
                            />
                            {
                                isfiled8err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginTop: 15 }}>
                                    Vehicle Origin must not be empty
                                </Text>) : (<></>)}
                            <View opacity={0} >
                                <ModalCountryPicker
                                    //withFlag={false}
                                    //style={{ flex: 0 }}
                                    selectCountryCode={(code) => setOrigin(code)}
                                    showPhikerModal={visibleCountryPicker}
                                    onClose={() => setVisibleCountryPicker(false)}
                                />
                            </View>

                            <Input
                                full
                                number
                                //maxLength={4}
                                label="Year Of Manufacture"
                                placeholder="Year Of Manufacture (YYYY)"
                                style={{ marginBottom: 15 }}
                                value={yearOfManufacture}
                                onChangeText={text => setYearOfManufacture(text)}
                            />
                            {
                                isfiled9err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Year Of Manufacture must be 4 characters
                                </Text>) : (<></>)}
                            {/* <Input
                                number
                                label="Number of seats"
                                style={{ marginBottom: 15, width: width - 50 }}
                                value={seats}
                                onChangeText={text => setSeats(text)}
                            /> */}
                            <Block>
                                <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", marginBottom: 5 }}>
                                    Number of seats
                                </Text>
                                <DropDownPicker
                                    items={seatList}
                                    //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                    placeholder="Select seats"
                                    defaultValue={seats}
                                    containerStyle={{ height: 40, width: width - 50, marginBottom: 25 }}
                                    onChangeItem={item => {
                                        //setDistanceDriven(item.value)
                                        setSeats(item.value)
                                        //initdocument(item.value)
                                    }}
                                />
                                {
                                    isfiled10err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Number of seats is required
                                    </Text>) : (<></>)}
                            </Block>

                            <Input
                                numeric
                                number
                                label="Distance Driven"
                                placeholder="...(km)"
                                style={{ marginBottom: 15, width: width - 50 }}
                                value={distanceDriven}
                                onChangeText={(newNum) => setDistanceDriven(newNum)}
                            />
                            {
                                isfiled11err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                    Distance Driven is required
                                </Text>) : (<></>)}
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
                                {
                                    isfiled12err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Contribute from date must not be empty
                                    </Text>) : (<></>)}
                                <DateTimePickerModal
                                    isVisible={isStartDateVisible}
                                    mode="date"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setStartDate(`${datetime.getFullYear()}-${("0" + (datetime.getMonth() + 1)).slice(-2)}-${("0" + datetime.getDate()).slice(-2)}`)
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
                                {
                                    isfiled13err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Contribute to date must not be empty
                                    </Text>) : (<></>)}
                                {
                                    isfiled14err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Contribute to date must not be sooner than Contribute from date
                                    </Text>) : (<></>)}
                                <DateTimePickerModal
                                    isVisible={isEndDateVisible}
                                    mode="date"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setEndDate(`${datetime.getFullYear()}-${("0" + (datetime.getMonth() + 1)).slice(-2)}-${("0" + datetime.getDate()).slice(-2)}`)
                                        //console.log(departureTime)
                                        setIsEndDateVisible(false)
                                    }}
                                    onCancel={text => setIsEndDateVisible(false)}
                                />
                                <Input
                                    full
                                    number
                                    label="Vehicle Value (Per month)"
                                    placeholder="...(VND)"
                                    style={{ marginBottom: 15 }}
                                    value={value}
                                    onChangeText={text => setValue(text)}
                                />
                                {
                                    isfiled15err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Vehicle Value (Per month) is required
                                    </Text>) : (<></>)}
                            </Block>
                        </Card>
                        <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Vehicle Documents">
                            <Block column center style={{ marginTop: 10 }}>
                                {
                                    isfiled26err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Must contain all document type!!
                                    </Text>) : (<></>)}
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
                                                    placeholder="9 to 12 characters"
                                                    style={{ marginBottom: 15, width: width - 100 }}
                                                    value={vehicleDocumentId}
                                                    onChangeText={text => setVehicleDocumentId(text)}
                                                />
                                                {
                                                    isfiled17err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Document ID need to be from 9 to 12 characters
                                                    </Text>) : (<></>)}
                                                <Block>
                                                    <Text caption medium style={{ textTransform: 'uppercase', textAlign: "left" }}>
                                                        Registered Location
                                </Text>
                                                    <DropDownPicker
                                                        items={cityData}
                                                        defaultValue={registeredLocation}
                                                        itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                                        placeholder="Select city"
                                                        containerStyle={{ height: 40, width: width - 100, marginBottom: 15 }}
                                                        onChangeItem={item => setRegisteredLocation(item.value)}
                                                    />
                                                    {
                                                        isfiled18err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                            Registered Location is required
                                                        </Text>) : (<></>)}
                                                    {/* {
                                    isfiled2err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Must select Registered Location
                                    </Text>) : (<></>)} */}

                                                </Block>
                                                {/* <Input
                                                    multiline={true}
                                                    maxLength={100}
                                                    label="Registered Location"
                                                    value={registeredLocation}
                                                    onChangeText={text => setRegisteredLocation(text)}
                                                    style={{ marginBottom: 15, height: 80, width: width - 100, textAlignVertical: "top" }}
                                                /> */}
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
                                                {
                                                    isfiled19err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Document type is required
                                                    </Text>) : (<></>)}
                                                {
                                                    isfiled25err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Document type is already existed
                                                    </Text>) : (<></>)}
                                                <Input
                                                    full
                                                    label="Registered date"
                                                    style={{ marginBottom: 15, width: width - 100 }}
                                                    value={registeredDate}
                                                    onFocus={() => setIsRegisteredDateVisible(true)}
                                                />
                                                {
                                                    isfiled20err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Registered date is required
                                                    </Text>) : (<></>)}
                                                <DateTimePickerModal
                                                    isVisible={isRegisteredDateVisible}
                                                    mode="date"
                                                    onConfirm={datetime => {
                                                        //console.log(datetime)
                                                        setRegisteredDate(`${datetime.getFullYear()}-${("0" + (datetime.getMonth() + 1)).slice(-2)}-${("0" + datetime.getDate()).slice(-2)}`)
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
                                                {
                                                    isfiled21err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Expiry date is required
                                                    </Text>) : (<></>)}
                                                {
                                                    isfiled22err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                        Expiry date must not be sooner than Registered date
                                                    </Text>) : (<></>)}
                                                <DateTimePickerModal
                                                    isVisible={isExpiryDateVisible}
                                                    mode="date"
                                                    onConfirm={datetime => {
                                                        //console.log(datetime)
                                                        setExpiryDate(`${datetime.getFullYear()}-${("0" + (datetime.getMonth() + 1)).slice(-2)}-${("0" + datetime.getDate()).slice(-2)}`)
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
                                                        {
                                                            isfiled23err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                                Must not be empty
                                                            </Text>) : (<></>)}
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
                                                        {
                                                            isfiled24err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                                                Must not be empty
                                                            </Text>) : (<></>)}
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
                                                    //addVehiceDocument()
                                                    checkCreateDocument()

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
                                    placeholder="1 - 100 characters"
                                    value={description}
                                    onChangeText={text => setDescription(text)}
                                    style={{ marginBottom: 15, height: 80, textAlignVertical: "top" }}
                                />
                                {
                                    isfiled16err ? (<Text caption medium style={{ textTransform: 'uppercase', textAlign: "left", color: "red", marginBottom: 10 }}>
                                        Description need to be from 1 to 100 characters
                                    </Text>) : (<></>)}
                                <Button full center style={styles.margin, { marginBottom: 10, width: width - 50 }} onPress={() => {
                                    //setIsDocumentVisible(!isDocumentVisible)
                                    //initPassengerList()
                                    //createRequest()
                                    //validateCreateRequest()
                                    checkCreateRequest()
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
