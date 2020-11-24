import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import RequestRepository from "../repositories/RequestRepository";

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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';

const { width } = Dimensions.get("window");

const RecentRequestScreen = ({ navigation, route }) => {
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
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setRequestTypes([])
        setIsDetailShow([])
        setIsLoading(true)
        getCurrentUser()
            .then(async (user) => {
                setUser(user);
                //Image_Http_URL = { uri: user["photoURL"] };
                await init(user.uid);
                initRequestTypes();
                setImage_Http_URL({ uri: user["photoURL"] });
                setUsername(user.displayName);
                setIsLoading(false)
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });

        //console.log(driverList);
        setIsLoading(false);
    }, [isFocused]);
    const init = async (uid) => {
        setIsLoading(true)
        await RequestRepository.getRecentRequest(`?userId=${uid}&sort=DESC`)
            .then((response) => {
                //console.log(response);
                const result = Object.values(response.requestRes);
                //console.log(result);
                setRequestList({
                    ...requestList,
                    result
                })
                // for (let i = 0; i < result.length; i++)
                //     setIsDetailShow(prevArray => [
                //         ...prevArray, {
                //             state: false
                //         }
                //     ])
            })
            .catch((error) => {
                console.log(error)
            })
        setIsLoading(false)
    }
    const filter = async (filterstring) => {
        setIsLoading(true)
        await RequestRepository.getRecentRequest(`?userId=${user.uid}&sort=DESC${filterstring}`)
            .then((response) => {
                const result = Object.values(response.requestRes);
                setRequestList({
                    ...requestList,
                    result
                })
            })
            .catch((error) => {
                console.log(error)
            })
        setSelectedStatus("");
        setFromDate("");
        setToDate("");
        setSelectedType("");
        setIsLoading(false)
    }
    const initRequestTypes = () => {
        RequestRepository.getRequestType()
            .then((response) => {
                //console.log(response);
                const result = Object.values(response);
                //console.log(result);
                for (let i = 0; i < result.length; i++)
                    setRequestTypes(prevArray => [
                        ...prevArray, {
                            label: result[i],
                            value: result[i]
                        }
                    ])
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const showDetail = (index) => {
        let newArr = [...isDetailShow];
        newArr[index] = !isDetailShow[index]
        setIsDetailShow(newArr);
    }
    const [requestList, setRequestList] = useState([{
    }
    ])
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [requestTypes, setRequestTypes] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [Image_Http_URL, setImage_Http_URL] = useState({});
    const [username, setUsername] = useState("");
    const [isFromDateVisible, setIsFromDateVisible] = useState(false);
    const [isToDateVisible, setIsToDateVisible] = useState(false);
    const [isDetailShow, setIsDetailShow] = useState([]);

    return (
        <SafeAreaView style={styles.overview}>
            <Header navigation={navigation} title="Recent Request" />
            <ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false)
                    }}
                >
                    <ScrollView style={styles.centeredView, { marginTop: 90 }}>
                        <Card style={styles.margin, { marginHorizontal: 10, marginTop: 70, marginBottom: 10 }} title="Filter options">
                            <Block row style={{ marginBottom: 25 }}>
                                <Input
                                    label="From date"
                                    style={{ marginRight: 15, width: width - 200 }}
                                    value={fromDate}
                                    //onChangeText={text => setDepartureTime(text)}
                                    onFocus={() => setIsFromDateVisible(true)}
                                //onPress={setIsDepartureVisible(true)}
                                />
                                <DateTimePickerModal
                                    isVisible={isFromDateVisible}
                                    mode="date"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setFromDate(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}`)
                                        console.log(fromDate)
                                        setIsFromDateVisible(false)
                                    }}
                                    onCancel={text => setIsFromDateVisible(false)}
                                />
                                <Input
                                    label="To date"
                                    style={{ width: width - 200 }}
                                    value={toDate}
                                    //onChangeText={text => setDestinationTime(text)}
                                    //onPress={setIsDestinationVisible(true)}
                                    onFocus={text => setIsToDateVisible(true)}
                                />
                                <DateTimePickerModal
                                    isVisible={isToDateVisible}
                                    mode="date"
                                    onConfirm={datetime => {
                                        //console.log(datetime)
                                        setToDate(`${datetime.getFullYear()}-${datetime.getMonth()}-${datetime.getDate()}`)
                                        console.log(destinationTime)
                                        setIsToDateVisible(false)
                                    }}
                                    onCancel={text => setIsToDateVisible(false)}
                                />
                            </Block>
                            <Text caption medium style={styles.label}>
                                Request status
                            </Text>
                            <DropDownPicker
                                items={[
                                    { label: 'ACCEPTED', value: 'ACCEPTED' },
                                    { label: 'PENDING', value: 'PENDING' },
                                    { label: 'DENIED', value: 'DENIED' },
                                ]}
                                defaultValue={selectedStatus}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                onChangeItem={item => setSelectedStatus(item.value)}
                            />
                            <Text caption medium style={styles.label}>
                                Request Type
                            </Text>
                            <DropDownPicker
                                items={requestTypes}
                                defaultValue={selectedType}
                                itemStyle={{ alignItems: 'flex-start|flex-end|center' }}
                                placeholder="Select type"
                                containerStyle={{ height: 40, width: 250, marginBottom: 25 }}
                                onChangeItem={item => setSelectedType(item.value)}
                            />
                            <Button center style={styles.margin} onPress={() => {
                                filter(`&requestStatus=${selectedStatus}&requestType=${selectedType}&fromDate=${fromDate}`);
                                //console.log(`&requestStatus=${selectedStatus}&requestType=${selectedType}&fromDate=${fromDate}$toDate=${toDate}`)
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
                            {/* <Text ligth caption style={{ paddingHorizontal: 16, marginTop: 3 }}>Contributor</Text> */}
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
                {requestList.length === 1 ? (
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
                ) : (<>
                    <Card row style={[styles.marginCard], { backgroundColor: theme.colors.gray2, height: 12 }} border="false" shadow="false">
                        <Block style={{ flex: 0.08 }}>
                            <Text medium caption style={[styles.label]}>
                                No.
        </Text>
                        </Block>
                        <Block style={{ flex: 0.7, marginLeft: 8 }}>
                            <Text medium caption style={[styles.label]}>
                                Request Type
        </Text>
                        </Block>
                        <Block style={{ flex: 0.3, marginLeft: 7 }}>
                            <Text medium caption style={[styles.label]}>
                                Status
        </Text>
                        </Block>
                        {/* <Block >
                        <Text medium caption style={[styles.label, { marginLeft: 25 }]}>
                            Status
                        </Text>
                    </Block> */}
                    </Card>
                    <FlatList
                        data={requestList.result}
                        renderItem={({ item, index }) =>
                            <>
                                <TouchableOpacity onPress={() => {
                                    setIsLoading(true);
                                    showDetail(item["requestId"]);
                                    //setIsDetailShow({...isDetailShow[index], true});
                                    setIsLoading(false);
                                }}>
                                    <Card center row style={[styles.marginCard]} style={{
                                        borderColor: theme.colors.lightBlue,
                                        borderWidth: 1,
                                    }}>
                                        <Block style={{ flex: 0.08 }}>
                                            <Text medium >
                                                {index}
                                            </Text>
                                        </Block>
                                        <Block style={{ flex: 0.7, marginLeft: 8 }}>
                                            <Text medium>
                                                {item["requestType"]}
                                            </Text>
                                        </Block>
                                        {/* <Block style={{ flex: 0.3, marginLeft: 5 }} >
                                        <Text medium>
                                            {item["requestStatus"]}
                                        </Text>
                                    </Block> */}
                                        <Block style={{ flex: 0.3, marginLeft: 7 }}>
                                            {item["requestStatus"] === "ACCEPTED" ? (<Text color="green" medium>
                                                {item["requestStatus"]}
                                            </Text>) : (item["requestStatus"] === "PENDING" ? (<Text medium color="yellow">
                                                {item["requestStatus"]}
                                            </Text>) : (<Text medium color="red">
                                                {item["requestStatus"]}
                                            </Text>))}

                                        </Block>
                                        {/* <Block >{item["userStatus"] === "ACTIVE" ? (<Text color="green" medium style={[{ marginLeft: 25 }]}>
                                            {item["userStatus"]}
                                        </Text>) : (<Text medium style={[{ marginLeft: 25 }]} color="red">
                                            {item["userStatus"]}
                                        </Text>)}

                                        </Block> */}
                                    </Card>

                                </TouchableOpacity>
                                {isDetailShow[item["requestId"]] === true ? (<>
                                    <Card center row style={[styles.marginCard]} style={{
                                        borderColor: theme.colors.lightBlue,
                                        borderWidth: 1,
                                        backgroundColor: theme.colors.gray,
                                        marginHorizontal: 10,
                                        marginBottom: 20
                                    }}>
                                        <Block>
                                            <Text medium >
                                                Create Date: {Moment(item["createDate"]).format('MMM Do YY')}
                                            </Text>
                                            <Text medium >
                                                Description: {item["description"]}
                                            </Text>
                                        </Block>
                                    </Card>
                                </>) : (<></>)}
                            </>
                        }
                    />
                </>)
                }
            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default RecentRequestScreen;
