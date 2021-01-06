import React, { useState, useEffect } from "react";
import VehicleRepository from "../repositories/VehicleRepository";
import { useIsFocused } from '@react-navigation/native'

import { Dimensions, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler, TouchableWithoutFeedback, Modal, View, TouchableHighlight, Picker, FlatList } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import * as theme from '../constants/theme';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from "../components/Header";
import Loader from '../components/Loader';

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
    const [Image_Http_URL, setImage_Http_URL] = useState({});
    const [username, setUsername] = useState("");
    const isFocused = useIsFocused();
    const { lastRefresh } = route.params;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setUser(user);
                initvehicletype();
                initvehiclestatus();
                setImage_Http_URL({ uri: user["photoURL"] });
                setUsername(user.displayName);
                init(user.uid)
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });

        console.log(vehicleList);
    }, [isFocused]);
    const init = async (uid) => {
        setIsLoading(true)
        await VehicleRepository.getVehicle(`?ownerId=${uid}`)
            .then((response) => {
                //console.log(response);
                // const result = Object.values(response.vehicleList);
                //console.log(result);
                setVehicleList(response)
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }

    const filter = async (filterstring) => {
        setIsLoading(true)
        await VehicleRepository.getVehicle(filterstring)
            .then((response) => {
                //console.log(response);
                //const result = Object.values(response.vehicleList);
                //console.log(result);
                //(result === null ? setIsNull(true) : setIsNull(false))
                setVehicleList(response)
            })
            .catch((error) => {
                console.log(error + "asd")
            })
        setSelectedStatus("");
        setFilterfrom("");
        setFilterto("");
        setSelectedType("");
        setIsLoading(false)
    }
    const initvehicletype = async () => {
        setIsLoading(true)
        setVehicleTypeList([])
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
    const initvehiclestatus = async () => {
        setIsLoading(true)
        setVehicleStatusList([])
        await VehicleRepository.getVehicleStatusList()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setVehicleStatusList(prevArray => [
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
    const [vehicletypeList, setVehicleTypeList] = useState([]);
    const [vehiclestatusList, setVehicleStatusList] = useState([]);
    const [vehicleList, setVehicleList] = useState([])
    const [isNull, setIsNull] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [filterfrom, setFilterfrom] = useState("");
    const [filterto, setFilterto] = useState("");
    const [filterstring, setFilterstring] = useState("");
    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Vehicles" />
            <ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible)
                    }}
                >
                    <ScrollView style={styles.centeredView}>

                        <Card style={styles.margin, { marginHorizontal: 10, marginTop: 70, marginBottom: 10 }} title="Filter options">
                            <Text caption medium style={styles.label}>
                                Vehicle type
          </Text>
                            {/* <DropDownPicker
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
                            /> */}
                            <DropDownPicker
                                items={vehicletypeList}
                                //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                defaultValue={selectedType}
                                containerStyle={{ height: 40, width: width - 75, marginBottom: 25 }}
                                onChangeItem={item => {
                                    setSelectedType(item.value)
                                    //initdocument(item.value)
                                }}
                            />
                            <Block row>
                                <Input
                                    number
                                    full
                                    label="Distance From"
                                    style={{ marginBottom: 25, width: width - 210, marginRight: 20 }}
                                    onChangeText={text => setFilterfrom(`&vehicleMinDis=${text}`)}
                                />
                                <Input
                                    number
                                    full
                                    label="Distance To"
                                    style={{ marginBottom: 25, width: width - 210 }}
                                    onChangeText={text => setFilterto(`&vehicleMaxDis=${text}`)}
                                />
                            </Block>

                            <Text caption medium style={styles.label}>
                                Request status
          </Text>
                            {/* <DropDownPicker
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
                            /> */}
                            <DropDownPicker
                                items={vehiclestatusList}
                                //itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select status"
                                defaultValue={selectedStatus}
                                containerStyle={{ height: 40, width: width - 75, marginBottom: 25 }}
                                onChangeItem={item => {
                                    setSelectedStatus(item.value)
                                    //initdocument(item.value)
                                }}
                            />
                            <Button center style={styles.margin} onPress={() => {
                                selectedStatus === "" ? (filter(`?${filterfrom}${filterto}&vehicleTypeId=${selectedType}&viewOption=0&ownerId=${user.uid}`)) : (filter(`?${filterfrom}${filterto}&vehicleStatus=${selectedStatus}&vehicleTypeId=${selectedType}&viewOption=1&ownerId=${user.uid}`))

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
                {vehicleList.length === 0 ? (
                    <Block style={{ marginTop: 15 }} center>
                        <Image
                            style={{ width: width - 100, height: width - 100 }}
                            source={ // if clicked a new img
                                require('../assets/images/emptylist.png')} //else show random
                        />
                        <Text large center caption >
                            LIST IS EMPTY
                    </Text>
                    </Block>
                ) : (
                        <FlatList
                            data={vehicleList}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() =>
                                    navigation.navigate("VehicleDetail", {
                                        itemId: item["vehicleId"],
                                    })}>
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
                                                {item["vehicleType"]["vehicleTypeName"]}
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
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
