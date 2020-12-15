import React, { useState, useEffect } from "react";
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import DriverRepository from '../repositories/DriverRepository';
import UserRepository from '../repositories/UserRepository';
import ReportRepository from "../repositories/ReportRepository";

import { SectionList, View, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, FlatList, Modal, BackHandler, TouchableWithoutFeedback, AsyncStorage } from "react-native";
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
import { Dimensions } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

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
        item: {
            padding: 10,
            fontSize: 18,
            height: 44,
        },
        sectionHeader: {
            paddingTop: 2,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 2,
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'rgba(247,247,247,1.0)',
        },
    });

    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser()
            .then(async (user) => {
                setUser(user);
                // init(user.uid);

                init(user.uid);
                initmonthlyIncome(user.uid);
            })
            .catch((error) => {
                setUser(null);
                console.log(error);
            });
    }, []);

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
                alert(error["debugMessage"]);
            });
    };
    const [T1Income, setT1Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T2Income, setT2Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T3Income, setT3Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T4Income, setT4Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T5Income, setT5Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T6Income, setT6Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T7Income, setT7Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T8Income, setT8Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T9Income, setT9Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T10Income, setT10Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T11Income, setT11Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [T12Income, setT12Income] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const [TIncome, setTIncome] = useState({
        earnedValue: -1,
        driverIncomes: [
            {
            }
        ]
    });
    const chartConfig = {
        backgroundGradientFrom: "#FFFFFF",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#FFFFFF",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0,191,255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
    };
    const initmonthlyIncome = async (id) => {
        setIsLoading(true)
        await ReportRepository.getDriverIncomesReportData(`/${id}/data`)
            .then((response) => {
                setTIncome(response)
            })
            .catch((error) => {
                console.log(error)
            })
        await ReportRepository.getDriverIncomesSummaryReportData(`/${id}/summary/data`)
            .then((response) => {
                setT1Income(response["driverIncomeSummaryMonthResList"][0]["driverIncomeRes"])
                setT2Income(response["driverIncomeSummaryMonthResList"][1]["driverIncomeRes"])
                setT3Income(response["driverIncomeSummaryMonthResList"][2]["driverIncomeRes"])
                setT4Income(response["driverIncomeSummaryMonthResList"][3]["driverIncomeRes"])
                setT5Income(response["driverIncomeSummaryMonthResList"][4]["driverIncomeRes"])
                setT6Income(response["driverIncomeSummaryMonthResList"][5]["driverIncomeRes"])
                setT7Income(response["driverIncomeSummaryMonthResList"][6]["driverIncomeRes"])
                setT8Income(response["driverIncomeSummaryMonthResList"][7]["driverIncomeRes"])
                setT9Income(response["driverIncomeSummaryMonthResList"][8]["driverIncomeRes"])
                setT10Income(response["driverIncomeSummaryMonthResList"][9]["driverIncomeRes"])
                setT11Income(response["driverIncomeSummaryMonthResList"][10]["driverIncomeRes"])
                setT12Income(response["driverIncomeSummaryMonthResList"][11]["driverIncomeRes"])
            })
            .catch((error) => {
                console.log(error)
            })
        //console.log(JSON.stringify(T10Income))
        setIsLoading(false)
    }
    const updateStatus = (userid) => {
        UserRepository.updateUserStatusByUserId(userid, 'INACTIVE')

    }
    //   const [user, setUser] = useState(null);

    const [documentVisible, setDocumentVisible] = useState(false);
    const isFocused = useIsFocused();
    const [driver, setDriver] = useState({});
    const [showModal, setshowModal] = useState(-1);
    const [imageIndex, setimageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    //let Image_Http_URL = { uri: driverdetailimage };
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
        //setIsLoading(false);
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
                                                        <Text style={{ marginLeft: 10 }} color="black3">Document ID: {item["userDocumentId"]}</Text>
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
                <Card title="CURRENT YEAR INCOME" style={[{ marginTop: 18 }]}>
                    {/* <Block>
            <LineChart
              data={{
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                datasets: [
                  {
                    //data: [T1Income["earned"] + T1Income["estimated"], T2Income["earned"] + T2Income["estimated"], T3Income["earned"] + T3Income["estimated"], T4Income["earned"] + T4Income["estimated"], T5Income["earned"] + T5Income["estimated"], T6Income["earned"] + T6Income["estimated"], T7Income["earned"] + T7Income["estimated"], T8Income["earned"] + T8Income["estimated"], T9Income["earned"] + T9Income["estimated"], T10Income["earned"] + T10Income["estimated"], T11Income["earned"] + T11Income["estimated"], T12Income["earned"] + T12Income["estimated"]],
                    data: [T1Income["earned"] / 1000000, T2Income["earned"] / 1000000, T3Income["earned"] / 1000000, T4Income["earned"] / 1000000, T5Income["earned"] / 1000000, T6Income["earned"] / 1000000, T7Income["earned"] / 1000000, T8Income["earned"] / 1000000, T9Income["earned"] / 1000000, T10Income["earned"] / 1000000, T11Income["earned"] / 1000000, T12Income["earned"] / 1000000],
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                    strokeWidth: 2 // optional
                  }
                ],
                legend: ["Revenue from Trips (per 1.000.000 VND)"] // optional
              }}
              width={screenWidth - 30}
              height={screenWidth - 150}
              chartConfig={chartConfig}
            />
          </Block> */}
                    <Block style={[{ marginTop: 18, marginBottom: 18 }]}>
                        <LineChart
                            data={{
                                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                                datasets: [
                                    {
                                        //data: [T1Income["earned"] + T1Income["estimated"], T2Income["earned"] + T2Income["estimated"], T3Income["earned"] + T3Income["estimated"], T4Income["earned"] + T4Income["estimated"], T5Income["earned"] + T5Income["estimated"], T6Income["earned"] + T6Income["estimated"], T7Income["earned"] + T7Income["estimated"], T8Income["earned"] + T8Income["estimated"], T9Income["earned"] + T9Income["estimated"], T10Income["earned"] + T10Income["estimated"], T11Income["earned"] + T11Income["estimated"], T12Income["earned"] + T12Income["estimated"]],
                                        data: [T1Income["earnedValue"] / 1000000, T2Income["earnedValue"] / 1000000, T3Income["earnedValue"] / 1000000, T4Income["earnedValue"] / 1000000, T5Income["earnedValue"] / 1000000, T6Income["earnedValue"] / 1000000, T7Income["earnedValue"] / 1000000, T8Income["earnedValue"] / 1000000, T9Income["earnedValue"] / 1000000, T10Income["earnedValue"] / 1000000, T11Income["earnedValue"] / 1000000, T12Income["earnedValue"] / 1000000],
                                        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                                        strokeWidth: 2 // optional
                                    }
                                ],
                                legend: ["Basic Revenue (per 1.000.000 VND)"] // optional
                            }}
                            width={screenWidth - 30}
                            height={screenWidth - 150}
                            chartConfig={chartConfig}
                        />
                        <SectionList
                            sections={[
                                { title: 'JANUARY', data: [`Revenue: ${T1Income["earnedValue"]}`] },
                                { title: 'FEBRUARY', data: [`Revenue: ${T2Income["earnedValue"]}`] },
                                { title: 'MARCH', data: [`Revenue: ${T3Income["earnedValue"]}`] },
                                { title: 'APRIL', data: [`Revenue: ${T4Income["earnedValue"]}`] },
                                { title: 'MAY', data: [`Revenue: ${T5Income["earnedValue"]}`] },
                                { title: 'JUNE', data: [`Revenue: ${T6Income["earnedValue"]}`] },
                                { title: 'JULY', data: [`Revenue: ${T7Income["earnedValue"]}`] },
                                { title: 'AUGUST', data: [`Revenue: ${T8Income["earnedValue"]}`] },
                                { title: 'SEPTEMBER', data: [`Revenue: ${T9Income["earnedValue"]}`] },
                                { title: 'OCTOBER', data: [`Revenue: ${T10Income["earnedValue"]}`] },
                                { title: 'NOVEMBER', data: [`Revenue: ${T11Income["earnedValue"]}`] },
                                { title: 'DECEMBER', data: [`Revenue: ${T12Income["earnedValue"]}`] },
                            ]}
                            renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
                            renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                            keyExtractor={(item, index) => index}
                        />

                    </Block>
                </Card>
                <Card title="TRIPS INCOME DETAIL" style={[{ marginTop: 18 }]}>
                    <Block>
                        <FlatList
                            data={TIncome["driverIncomes"]}
                            renderItem={({ item, index }) => <>
                                <Text style={styles.sectionHeader}>Contract Id: {item.contractId}</Text>
                                <Text style={styles.item}>Vehicle Id: {item.vehicleId}</Text>
                                <Text style={styles.item}>Driver Earned: {item.driverEarned}</Text>

                            </>}
                        />
                    </Block>
                </Card>
            </ScrollView>
            <Loader isAnimate={isLoading} />
        </SafeAreaView>
    );
};

export default ProfileScreen;
