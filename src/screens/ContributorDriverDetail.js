import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import ContributorRepository from '../repositories/ContributorRepository';
import VehicleRepository from '../repositories/VehicleRepository';
import DriverRepository from '../repositories/DriverRepository';
import FeedbackRepository from '../repositories/FeedbackRepository';

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
import StarRating from 'react-native-star-rating';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width } = Dimensions.get("window");

const DriverDetail = ({ navigation, route }) => {
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
    const { itemId } = route.params;
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setshowModal] = useState(-1);
    const [imageIndex, setimageIndex] = useState(0);
    const [ratingModalVisible, setRatingModalVisible] = useState(false);

    const renderImages = (item, parindex) => (
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
                        style={{ height: width - 250, width: width - 225, marginBottom: 25, marginRight: 15 }}
                        center />
                </TouchableOpacity>
            } />
    )

    useEffect(() => {

        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                init();
                //console.log(Profile_Image);

            })
            .catch((error) => {
                setUser(null);
                console.log(error);
                setIsLoading(false);
            });

    }, [isFocused]);

    const _storeData = () => {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => alert('success'));
    };
    const [driver, setDriver] = useState({})
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(0);
    const init = async () => {
        setIsLoading(true);
        await DriverRepository.getDetailDriver(itemId)
            .then((response) => {
                //console.log(response);
                const result = Object.entries(response);
                setDriver(response);
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false);
    }

    const sendFeedback = (driverId) => {
        VehicleRepository.getCurrentlyAssignedVehicleByDriverId(driverId)
            .then((response) => {
                // console.log(response)
                // setIssuedvehicleid(response["issuedVehicleId"])
                let data = {
                    comment: comment,
                    issuedVehicleId: response["issuedVehicleId"],
                    rate: rate
                }
                console.log(data)
                FeedbackRepository.createFeedback(data)
                    .then((response) => {
                        console.log(response.status)
                        Alert.alert(
                            'Rated',
                            'Feedback sent!!!',
                            [
                                // {
                                //     text: 'Back to menu',
                                //     onPress: () => navigation.navigate("Service")
                                // },
                                {
                                    text: 'Close',
                                    onPress: () => console.log('Cancel Pressed'),
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
            })
            .catch((error) => {
                console.log(JSON.stringify(error))
            })
        setComment('')
        setRate(0)
    }

    return (
        <SafeAreaView style={styles.overview}>
            <Loader isAnimate={isLoading} />
            <Header navigation={navigation} title="Driver profile" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 40, }} title="Driver profile">
                    <Block column center style={{ marginTop: 10 }}>
                        <Image source={{ uri: driver["imageLink"] }} style={{ height: 100, width: 100, marginBottom: 25 }} center />
                        <Block style={{ marginBottom: 25 }}>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={ratingModalVisible}
                                onRequestClose={() => {
                                    setRatingModalVisible(!ratingModalVisible)
                                }}
                            >
                                <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                                    <Card style={styles.margin} title="Rate driver">
                                        <Block column style={{ marginBottom: 25 }}>
                                            <Text caption medium style={styles.label, { marginBottom: 10 }}>
                                                Rate
                            </Text>
                                            <StarRating
                                                disabled={false}
                                                // emptyStar={'ios-star-outline'}
                                                // fullStar={'ios-star'}
                                                // halfStar={'ios-star-half'}
                                                // iconSet={'Ionicons'}
                                                maxStars={5}
                                                rating={rate}
                                                selectedStar={(rating) => setRate(rating)}
                                                fullStarColor={'yellow'}
                                            />

                                        </Block>
                                        <Input
                                            multiline={true}
                                            onChangeText={text => setComment(text)}
                                            label="Comment"
                                            value={comment}
                                            style={{ marginBottom: 25, height: width - 200, width: width - 100, textAlignVertical: "top" }}

                                        />
                                        <Button center style={styles.margin, { marginBottom: 15 }}
                                            onPress={() => {
                                                sendFeedback(itemId)
                                                setRatingModalVisible(!ratingModalVisible)
                                            }}
                                        >
                                            <Text color="white">
                                                Rate
            </Text>
                                        </Button>
                                    </Card>
                                </ScrollView>
                            </Modal>
                            <TouchableOpacity
                                onPress={() => {
                                    setRatingModalVisible(!ratingModalVisible)
                                }}
                            >
                                <Block row center style={{ marginTop: 5 }}>
                                    <Icon name="star-outlined" style={{ marginRight: 5 }} />
                                    <Text medium caption>
                                        RATE THIS DRIVER
                                    </Text>

                                </Block>

                            </TouchableOpacity>
                        </Block>

                        <Input
                            full
                            label="Phone number"
                            value={driver["phoneNumber"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Full name"
                            value={driver["fullName"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Gender"
                            value={driver["gender"] === true ? "Male" : "Female"}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Birthdate"
                            value={driver["dateOfBirth"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            multiline={true}
                            full
                            label="Address"
                            value={driver["address"]}
                            style={{ marginBottom: 25, height: 80, textAlignVertical: "top" }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Vehicle Driving"
                            value={driver["vehicleId"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            label="Base Salary"
                            value={JSON.stringify(driver["baseSalary"])}
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
                                    data={driver["userDocumentList"]}
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
                                                    <Text h4 style={{ marginBottom: 15 }} color="brown">TYPE: {item["userDocumentType"]}</Text>
                                                </Block>
                                                <Block row>
                                                    {renderImages(item, index)}
                                                    <Modal visible={showModal === index} transparent={true} onSwipeDown={() => setshowModal(-1)}>
                                                        {item["userDocumentImages"][1] === undefined ? item["userDocumentImages"][0] === undefined ? (<></>) :
                                                            (<ImageViewer
                                                                imageUrls={[{
                                                                    url: item["userDocumentImages"][0]["imageLink"],

                                                                    props: {
                                                                    }
                                                                }]}
                                                                index={imageIndex}
                                                                onSwipeDown={() => setshowModal(-1)}
                                                                // onMove={data => console.log(data)}
                                                                enableSwipeDown={true} />) :
                                                            (<ImageViewer
                                                                imageUrls={[{
                                                                    url: item["userDocumentImages"][0]["imageLink"],

                                                                    props: {
                                                                    }
                                                                }, {
                                                                    url: item["userDocumentImages"][1]["imageLink"],

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
                                                        <Text style={{ marginLeft: 10 }} color="black3">Document number: {item["userDocumentNumber"]}</Text>
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
            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default DriverDetail;
