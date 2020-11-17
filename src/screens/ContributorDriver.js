import React, { useState, useEffect } from "react";
import axios from 'axios';
import Repository from "../repositories/Repository";
import DriverRepository from "../repositories/DriverRepository";

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, Modal, View, TouchableHighlight, Picker, FlatList } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Label from '../components/Label';
import menu from '../assets/images/icons/menu.png';
import * as theme from '../constants/theme';
import Auth from "@react-native-firebase/auth";
import DropDownPicker from 'react-native-dropdown-picker';
import Header from "../components/Header";
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
        marginButton: {
            height: 35,
            width: 135,
            marginTop: 15,
            marginRight: 10
        },
        marginCard: {
            height: 60,
            marginTop: 3,
        },
        driver: {
            marginBottom: 11,
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
        centeredView: {
            flex: 1,
            justifyContent: "center",
            marginTop: 90,
        },
        modalView: {
            backgroundColor: "white",
            padding: 115,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        openButton: {
            backgroundColor: "#F194FF",
            borderRadius: 20,
            padding: 10,
            elevation: 2
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        },
        label: {
            textTransform: 'uppercase',
            marginBottom: 8
        },
    });

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        getCurrentUser()
            .then((user) => {
                setUser(user);
                //Image_Http_URL = { uri: user["photoURL"] };
                init(user.uid);
                setImage_Http_URL({ uri: user["photoURL"] });
                setUsername(user.displayName);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });

        //console.log(driverList);
        setIsLoading(false);
    }, []);
    const init = (uid) => {
        // DriverRepository.getIssuedDrivers(uid)
        //     .then((response) => {
        //         //console.log(response);
        //         const result = Object.values(response.drivers);
        //         //console.log(result);
        //         setDriverList({
        //             ...driverList,
        //             result
        //         })
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        DriverRepository.getDriver("")
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.driverRes);
                //console.log(result);
                setDriverList({
                    ...driverList,
                    result
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const filter = filterstring => {
        // DriverRepository.getIssuedDrivers(`${user.uid}${filterstring}`)
        //     .then((response) => {
        //         //console.log(response);
        //         const result = Object.values(response.drivers);
        //         //console.log(result);
        //         (result === null ? setIsNull(true) : setIsNull(false))
        //         setDriverList({
        //             ...driverList,
        //             result
        //         })
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        DriverRepository.getDriver(`${filterstring}`)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.driverRes);
                //console.log(result);
                setDriverList({
                    ...driverList,
                    result
                })
            })
            .catch((error) => {
                console.log(error)
            })
        setSelectedStatus("");
        setFiltername("");
        setFilterphone("");
    }

    const [driverList, setDriverList] = useState([{
    }
    ])
    const [isNull, setIsNull] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState("Document update");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filtername, setFiltername] = useState("");
    const [filterphone, setFilterphone] = useState("");
    const [Image_Http_URL, setImage_Http_URL] = useState({});
    const [username, setUsername] = useState("");

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Drivers" />
            <ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                        <Card style={styles.margin, { marginHorizontal: 10, marginTop: 70, marginBottom: 10 }} title="Filter options">
                            <Input
                                full
                                label="Name"
                                style={{ marginBottom: 25, width: 250 }}
                                onChangeText={text => setFiltername(text)}
                            />
                            <Input
                                number
                                full
                                label="Phone Number"
                                style={{ marginBottom: 25, width: 250 }}
                                onChangeText={text => setFilterphone(text)}
                            />
                            {/* <Text caption medium style={styles.label}>
                                Request status
          </Text>
                            <DropDownPicker
                                items={[
                                    { label: 'ACTIVE', value: 'ACTIVE' },
                                    { label: 'INACTIVE', value: 'INACTIVE' },
                                ]}
                                defaultValue={selectedStatus}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                onChangeItem={item => setSelectedStatus(item.value)}
                            /> */}
                            <Button center style={styles.margin} onPress={() => {
                                filter(`?name=${filtername}&phoneNumber=${filterphone}`);
                                setModalVisible(!modalVisible);
                            }}>
                                <Text color="white">
                                    Filter
            </Text>
                            </Button>
                        </Card>
                    </ScrollView>
                </Modal>
                <Card column middle>
                    <Block flex={1.2} row style={{ marginRight: 20 }}>
                        <Image source={Image_Http_URL} style={{ height: 50, width: 50, borderRadius: 400 / 2 }} />
                        <Block>
                            <Text style={{ paddingHorizontal: 16, marginTop: 3 }}>{username}</Text>
                            <Text ligth caption style={{ paddingHorizontal: 16, marginTop: 3 }}>Contributor</Text>
                        </Block>

                    </Block>
                    <Block row>

                        <Button style={styles.marginButton} onPress={() => {
                            setModalVisible(true);
                        }}>
                            <Text color="white">
                                Filter
            </Text>
                        </Button>
                    </Block>
                </Card>
                {/* <Block row style={[styles.margin, { marginTop: 30 }]}>
        <Text caption medium style={[styles.label, { marginLeft: 5 }]}>
                ID
          </Text>
          <Text caption medium style={[styles.label, { marginLeft: 35 }]}>
                Subject
          </Text>
          <Text caption medium style={[styles.label, { marginLeft: 50 }]}>
                Status
          </Text>
        </Block> */}
                <Card row style={[styles.marginCard], { backgroundColor: theme.colors.gray2, height: 12 }} border="false" shadow="false">
                    <Block style={{ flex: 0.5 }}>
                        <Text medium caption style={[styles.label]}>
                            No.
        </Text>
                    </Block>
                    <Block>
                        <Text medium caption style={[styles.label]}>
                            Phone
        </Text>
                    </Block>
                    <Block>
                        <Text medium caption style={[styles.label, { width: 90, marginLeft: 13 }]}>
                            Name
        </Text>
                    </Block>
                    {/* <Block >
                        <Text medium caption style={[styles.label, { marginLeft: 25 }]}>
                            Status
                        </Text>
                    </Block> */}
                </Card>
                {isNull === true ? (
                    <Block >
                        <Text medium caption style={[styles.label, { marginLeft: 14 }]}>
                            Status
                    </Text>
                    </Block>
                ) : (
                        <FlatList
                            data={driverList.result}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => {
                                    setIsLoading(true);
                                    setIsLoading(false);
                                    navigation.navigate("DriverDetail", {
                                        itemId: item["userId"],
                                    })
                                }}>
                                    <Card center row style={[styles.marginCard]} style={{
                                        borderColor: theme.colors.lightBlue,
                                        borderWidth: 1,
                                    }}>
                                        <Block style={{ flex: 0.5 }}>
                                            <Text medium>
                                                {index}
                                            </Text>
                                        </Block>
                                        <Block>
                                            <Text medium>
                                                {item["phoneNumber"]}
                                            </Text>
                                        </Block>
                                        <Block>
                                            <Text medium style={{ width: 90, marginLeft: 13 }}>
                                                {item["fullName"]}
                                            </Text>
                                        </Block>
                                        {/* <Block >{item["userStatus"] === "ACTIVE" ? (<Text color="green" medium style={[{ marginLeft: 25 }]}>
                                            {item["userStatus"]}
                                        </Text>) : (<Text medium style={[{ marginLeft: 25 }]} color="red">
                                            {item["userStatus"]}
                                        </Text>)}

                                        </Block> */}
                                    </Card>
                                </TouchableOpacity>}
                        />
                    )
                }
            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
