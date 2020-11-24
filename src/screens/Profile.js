import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import DriverRepository from '../repositories/DriverRepository';
import UserRepository from '../repositories/UserRepository';

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, FlatList, Modal, BackHandler, TouchableWithoutFeedback, AsyncStorage } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from "react-native-vector-icons/Entypo";
import Label from '../components/Label';
import menu from '../assets/images/icons/menu.png';
import * as theme from '../constants/theme';
import Auth from "@react-native-firebase/auth";
import Header from "../components/Header";
import ImageViewer from 'react-native-image-zoom-viewer';
import Loader from '../components/Loader';

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

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setUser(user);
                // init(user.uid);
                init(user.uid);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });
    }, [isFocused]);

    // const _storeData = () => {
    //     AsyncStorage.getAllKeys()
    //         .then(keys => AsyncStorage.multiRemove(keys))
    //         .then(() => alert('success'));
    // };

    const signOut = () => {
        signOutUser()
            .then(() => {
                updateStatus(user.uid);
                //_storeData();
                BackHandler.exitApp();
            })
            .catch((error) => {
                alert(error);
            });
    };
    const updateStatus = (userid) => {
        UserRepository.updateUserStatusByUserId(userid, 'INACTIVE')

    }
    //   const [user, setUser] = useState(null);

    const [documentVisible, setDocumentVisible] = useState(false);
    const isFocused = useIsFocused();
    const [driver, setDriver] = useState({});
    const [showModal, setshowModal] = useState(-1);
    const [imageIndex, setimageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    //let Image_Http_URL = { uri: driverdetailimage };
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
    const init = async (userid) => {
        setIsLoading(true);
        await DriverRepository.getDetailDriver(userid)
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

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Profile" />
            <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>

                <Card column middle style={styles.margin, { marginHorizontal: 10, marginTop: 20, }} title="Personal profile">
                    <Block column center style={{ marginTop: 10 }}>
                        <Block style={{ marginBottom: 25 }}>
                            <Image source={{ uri: driver["imageLink"] }} style={{ height: 100, width: 100, marginBottom: 25 }} center />
                            <TouchableOpacity
                                onPress={() => {
                                    signOut()
                                }}
                            >
                                <Block row >
                                    <Icon name="log-out" style={{ marginRight: 5 }} />
                                    <Text medium caption>
                                        LOG OUT
                            </Text>

                                </Block>

                            </TouchableOpacity>
                        </Block>
                        <Input
                            full
                            email
                            label="Phone number"
                            value={driver["phoneNumber"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            email
                            label="Full name"
                            value={driver["gender"] === true ? "Male" : "Female"}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            email
                            label="Birthdate"
                            value={driver["dateOfBirth"]}
                            style={{ marginBottom: 25 }}
                            editable={false}
                        />
                        <Input
                            full
                            multiline={true}
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
                        {/* <Button full style={styles.margin} onPress={signOut}>
                            <Text color="white">
                                Sign out
            </Text>
                        </Button> */}
                    </Block>


                </Card>
            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
