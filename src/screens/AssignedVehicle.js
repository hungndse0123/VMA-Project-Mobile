import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import VehicleRepository from '../repositories/VehicleRepository';
import DocumentRepository from '../repositories/DocumentRepository';

import { Dimensions, Modal, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, FlatList, AsyncStorage } from "react-native";
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

const { width } = Dimensions.get("window");


const VehicleDetail = ({ navigation, route }) => {
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
    const [documentVisible, setDocumentVisible] = useState(false);
    const [showModal, setshowModal] = useState(-1);
    const [imageIndex, setimageIndex] = useState(0);
    //const { itemId } = route.params;
    const isFocused = useIsFocused();
    const [vehicleType, setVehicleType] = useState('');
    const [brandName, setBrandName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {

        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                initvehicleid(user.uid)
                //init();
                //console.log(Profile_Image);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });

    }, [isFocused]);

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
            data={item["imageLinks"]}
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
                        style={{ height: width - 250, width: width - 225, marginBottom: 25, marginRight: 15 }}
                        center />
                </TouchableOpacity>
            } />
    )
    const [vehicle, setVehicle] = useState({})
    const [vehicleDocument, setVehicleDocument] = useState([])
    const initvehicleid = async (userId) => {
        setIsLoading(true)
        await VehicleRepository.getCurrentlyAssignedVehicleByDriverId(userId)
            .then(async (response) => {
                await VehicleRepository.getDetailVehicle(response.vehicleId)
                    .then((response) => {
                        response !== null ? setVehicle(response) : setVehicle({})

                        response["vehicleType"]["vehicleTypeName"] !== null ? setVehicleType(response["vehicleType"]["vehicleTypeName"]) : setVehicleType('')
                        response["brand"]["brandName"] !== null ? setBrandName(response["brand"]["brandName"]) : setBrandName('')
                        response["assignedDriver"]["userName"] !== null ? setDriverName(response["assignedDriver"]["userName"]) : setDriverName('')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                await DocumentRepository.getVehicleDocument(`?vehicleId=${response.vehicleId}&viewOption=1`)
                    .then((response) => {

                        response !== null ? setVehicleDocument(response) : setVehicleDocument([])
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const init = async () => {
        setIsLoading(true)
        await VehicleRepository.getDetailVehicle(itemId)
            .then((response) => {
                const result = Object.entries(response);
                setVehicle(response);
                setVehicleType(response["vehicleType"]["vehicleTypeName"])
                setBrandName(response["brand"]["brandName"])
                setDriverName(response["assignedDriver"]["userName"])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const initdummy = () => {

        //console.log(response);
        //const result = Object.entries(response);
        //console.log(response["userId"]);
        //console.log(result["userId"]);
        // setDriver({
        //     ...driver,
        //     result
        // })
        // setVehicle(response);
        // setVehicleType(response["vehicleType"]["vehicleTypeName"])
        // setBrandName(response["brand"]["brandName"])
        // setDriverName(response["assignedDriver"]["userName"])
    }
    //const [contributor, setContributor] = useState(null);


    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Vehicle detail" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
                {vehicle !== {} ? (
                    <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Vehicle detail">
                        <Block column center style={{ marginTop: 10 }}>
                            <Image source={{ uri: vehicle["imageLink"] }} style={{ height: 250, width: 250, marginBottom: 25 }} center />
                            <Input
                                full
                                label="Vehicle number"
                                value={vehicle["vehicleId"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Vehicle Type"
                                value={vehicleType}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Brand"
                                value={brandName}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Status"
                                value={vehicle["vehicleStatus"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Seats"
                                value={JSON.stringify(vehicle["seats"])}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Model"
                                value={vehicle["model"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Origin"
                                value={vehicle["origin"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Chassis Number"
                                value={vehicle["chassisNumber"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Engine Number"
                                value={vehicle["engineNumber"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Manufacture Year"
                                value={vehicle["yearOfManufacture"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Registration Date"
                                value={vehicle["dateOfRegistration"]}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Distance Driven"
                                value={JSON.stringify(vehicle["distanceDriven"])}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />
                            <Input
                                full
                                label="Assigned to driver"
                                value={driverName}
                                style={{ marginBottom: 25 }}
                                editable={false}
                            />

                            <Button full center style={styles.margin, { marginBottom: 10 }} onPress={() => {
                                setDocumentVisible(!documentVisible);
                            }}>
                                <Block row center>
                                    <Text color="white">
                                        View Documents
                            </Text>
                                    {documentVisible ? <Icon name="chevron-small-up" size={15} color="white" style={{ alignItems: 'flex-end' }} /> : <Icon name="chevron-small-down" size={15} color="white" style={{ alignItems: 'flex-end' }} />}
                                </Block>
                            </Button>
                            {documentVisible ?
                                (<Block row style={{ marginTop: 10, marginBottom: 15 }}>
                                    <FlatList
                                        data={vehicleDocument}
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
                                                                        url: item["imageLinks"][0]["imageLink"],

                                                                        props: {
                                                                        }
                                                                    }]}
                                                                    index={imageIndex}
                                                                    onSwipeDown={() => setshowModal(-1)}
                                                                    // onMove={data => console.log(data)}
                                                                    enableSwipeDown={true} />) :
                                                                (<ImageViewer
                                                                    imageUrls={[{
                                                                        url: item["imageLinks"][0]["imageLink"],

                                                                        props: {
                                                                        }
                                                                    }, {
                                                                        url: item["imageLinks"][1]["imageLink"],

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
                                                            <Text style={{ marginLeft: 10 }} color="black3">Document Number: {item["vehicleDocumentNumber"]}</Text>
                                                            <Text style={{ marginLeft: 10 }} color="black3">Registered Location: {item["registeredLocation"]}</Text>
                                                            <Text style={{ marginLeft: 10 }} color="black3">Registered Date: {item["registeredDate"]}</Text>
                                                            <Text style={{ marginLeft: 10 }} color="black3">Expiry Date: {item["expiryDate"]}</Text>
                                                        </Block>
                                                    </Block>
                                                </Block>
                                            </TouchableWithoutFeedback>
                                        } />
                                </Block>) : (<></>)
                            }
                        </Block>
                    </Card>
                ) : (<></>)}
            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default VehicleDetail;
