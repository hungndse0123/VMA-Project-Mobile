import React, { useState, useEffect } from "react";
import VehicleRepository from "../repositories/VehicleRepository";

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
import { Left } from "native-base";
import Header from "../components/Header";

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
            marginTop: 22,
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

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setUser(user);
                init(user.uid)
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });


        console.log(vehicleList);
    }, []);
    const init = (uid) => {
        VehicleRepository.getVehicle(`?ownerId=${uid}`)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.vehicleList);
                //console.log(result);
                setVehicleList({
                    ...vehicleList,
                    result
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const filter = filterstring => {
        console.log(filterstring)
        VehicleRepository.getVehicle(filterstring)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.vehicleList);
                //console.log(result);
                //(result === null ? setIsNull(true) : setIsNull(false))
                setVehicleList({
                    ...vehicleList,
                    result
                })
            })
            .catch((error) => {
                console.log(error + "asd")
            })
        setSelectedStatus("");
        setFilterfrom("");
        setFilterto("");
        setSelectedType("");
    }
    const [vehicleList, setVehicleList] = useState([{
    }
    ])
    const [isNull, setIsNull] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [filterfrom, setFilterfrom] = useState("");
    const [filterto, setFilterto] = useState("");
    const [filterstring, setFilterstring] = useState("");
    let Image_Http_URL = { uri: "https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.0-9/80742826_2481110258768067_7881332290297528320_o.jpg?_nc_cat=104&ccb=2&_nc_sid=09cbfe&_nc_ohc=xABpuTzKeNkAX9UlkVS&_nc_ht=scontent.fsgn2-5.fna&oh=ba9257d410d63d4dd10fc28bf9d9bfb6&oe=5FBF8173" };
    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Vehicles" />
            <ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    {/* <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View> */}
                    <View style={styles.centeredView}>
                        <Card style={styles.margin, { marginHorizontal: 10, marginTop: 70, marginBottom: 10 }} title="Filter options">
                            <Text caption medium style={styles.label}>
                                Vehicle type
          </Text>
                            <DropDownPicker
                                items={[
                                    { label: 'Car', value: '&vehicleTypeId=1' },
                                    { label: 'Coach', value: '&vehicleTypeId=2' },
                                    { label: 'Truck', value: '&vehicleTypeId=3' },
                                    { label: 'Specialized', value: '&vehicleTypeId=4' },
                                ]}
                                defaultValue={selectedType}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                onChangeItem={(item) => {
                                    setSelectedType(item.value)
                                }}
                            />
                            <Input
                                number
                                full
                                label="Distance From"
                                style={{ marginBottom: 25, width: 250 }}
                                onChangeText={text => setFilterfrom(`&vehicleMinDis=${text}`)}
                            />
                            <Input
                                number
                                full
                                label="Distance To"
                                style={{ marginBottom: 25, width: 250 }}
                                onChangeText={text => setFilterto(`&vehicleMaxDis=${text}`)}
                            />
                            <Text caption medium style={styles.label}>
                                Request status
          </Text>
                            <DropDownPicker
                                items={[
                                    { label: 'AVAILABLE', value: '&vehicleStatus=AVAILABLE' },
                                    { label: 'ON ROUTE', value: '&vehicleStatus=ON_ROUTE' },
                                    { label: 'MAINTENANCE', value: '&vehicleStatus=MAINTENANCE' },
                                    { label: 'NO DRIVER', value: '&vehicleStatus=AVAILABLE_NO_DRIVER' },
                                    { label: 'PENDING APPROVAL', value: '&vehicleStatus=PENDING_APPROVAL' },
                                ]}
                                defaultValue={selectedStatus}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                onChangeItem={item => setSelectedStatus(item.value)}
                            />
                            <Button center style={styles.margin} onPress={() => {
                                selectedStatus === "" ? (filter(`?${filterfrom}${filterto}${selectedType}&viewOption=0&ownerId=${user.uid}`)) : (filter(`?${filterfrom}${filterto}${selectedStatus}${selectedType}&viewOption=1&ownerId=${user.uid}`))

                                setModalVisible(!modalVisible);
                            }}>
                                <Text color="white">
                                    Filter
                                </Text>
                            </Button>
                        </Card>
                    </View>
                </Modal>
                <Card column middle>
                    <Block flex={1.2} row style={{ marginRight: 20 }}>
                        <Image source={Image_Http_URL} style={{ height: 50, width: 50, borderRadius: 400 / 2 }} />
                        <Block>
                            <Text style={{ paddingHorizontal: 16, marginTop: 3 }}>Nguyen Duc Hung</Text>
                            <Text ligth caption style={{ paddingHorizontal: 16, marginTop: 3 }}>Driver</Text>
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
                <Card row style={[styles.marginCard], { backgroundColor: theme.colors.gray2, height: 12 }} border="false" shadow="false">
                    <Block>
                        <Text medium caption style={[styles.label]}>
                            ID
        </Text>
                    </Block>
                    <Block>
                        <Text medium caption style={[styles.label, { width: 90, marginLeft: 13 }]}>
                            Type
        </Text>
                    </Block>
                    <Block >
                        <Text medium caption style={[styles.label, { marginLeft: 25 }]}>
                            Status
        </Text>
                    </Block>
                </Card>
                {isNull === true ? (
                    <Block >
                        <Text medium caption style={[styles.label, { marginLeft: 14 }]}>
                            Status
                    </Text>
                    </Block>
                ) : (
                        <FlatList
                            data={vehicleList.result}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => navigation.navigate("Service")}>
                                    <Card center row style={[styles.marginCard]} style={{
                                        borderColor: theme.colors.lightBlue,
                                        borderWidth: 1,
                                    }}>
                                        <Block>
                                            <Text medium>
                                                {item["vehicleId"]}
                                            </Text>
                                        </Block>
                                        <Block>
                                            <Text medium style={{ width: 90, marginLeft: 13 }}>
                                                {item["vehicleTypeName"]}
                                            </Text>
                                        </Block>
                                        <Block >{item["vehicleStatus"] === "AVAILABLE" ? (<Text color="green" medium style={[{ marginLeft: 25 }]}>
                                            {item["vehicleStatus"]}
                                        </Text>) : (<Text medium style={[{ marginLeft: 25 }]} color="red">
                                            {item["vehicleStatus"]}
                                        </Text>)}

                                        </Block>

                                    </Card>
                                </TouchableOpacity>}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )
                }

            </ScrollView>

        </SafeAreaView>
    );
};

export default ProfileScreen;
