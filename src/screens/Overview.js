import React, { useState, useEffect } from "react";

import { SectionList, View, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import VehicleRepository from "../repositories/VehicleRepository";
import ReportRepository from "../repositories/ReportRepository";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import Label from '../components/Label';
import Header from '../components/Header';
import menu from '../assets/images/icons/menu.png';
import * as theme from '../constants/theme';
import Loader from '../components/Loader';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

const OverviewScreen = ({ navigation }) => {
  const styles = StyleSheet.create({
    overview: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.white,
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
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleCountAll, setVehicleCountAll] = useState(-1);
  const [vehicleCountOnRoute, setVehicleCountOnRoute] = useState(-1);
  const [vehicleCountAvailable, setVehicleCountAvailable] = useState(-1);
  const [vehicleCountAvailableNoDriver, setVehicleCountAvailableNoDriver] = useState(-1);
  const [vehicleCountMaintenance, setVehicleCountMaintenance] = useState(-1);
  const [vehicleCountNeedRepair, setVehicleCountNeedRepair] = useState(-1);
  const [vehicleCountPendingApproval, setVehicleCountPendingApproval] = useState(-1);
  const [vehicleCountSedan, setVehicleCountSedan] = useState(-1);
  const [vehicleCountSUV, setVehicleCountSUV] = useState(-1);
  const [vehicleCountMinivan, setVehicleCountMinivan] = useState(-1);
  const [vehicleCountMinibus, setVehicleCountMinibus] = useState(-1);
  const [vehicleCountMediumBus, setVehicleCountMediumBus] = useState(-1);
  const [vehicleCountLargeBus, setVehicleCountLargeBus] = useState(-1);
  const [vehicleCountSleeperBus, setVehicleCountSleeperBus] = useState(-1);
  const data = {
    // labels: ["Swim"], // optional
    data: [0.8]
  };
  const [T1Income, setT1Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T2Income, setT2Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T3Income, setT3Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T4Income, setT4Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {

      }
    ]
  });
  const [T5Income, setT5Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {

      }
    ]
  });
  const [T6Income, setT6Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T7Income, setT7Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T8Income, setT8Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T9Income, setT9Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T10Income, setT10Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [T11Income, setT11Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {

      }
    ]
  });
  const [T12Income, setT12Income] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [
      {
      }
    ]
  });
  const [TIncome, setTIncome] = useState({
    estimated: -1,
    earned: -1,
    contributorIncomesDetails: [{}]
  });
  const initmonthlyIncome = async (id) => {
    setIsLoading(true)
    await ReportRepository.getContributorIncomesSummaryReportData(`/${id}/summary/data`)
      .then((response) => {
        setT1Income(response["contributorIncomeSummaryMonthResList"][0]["contributorEarnedAndEstimatedIncome"])
        setT2Income(response["contributorIncomeSummaryMonthResList"][1]["contributorEarnedAndEstimatedIncome"])
        setT3Income(response["contributorIncomeSummaryMonthResList"][2]["contributorEarnedAndEstimatedIncome"])
        setT4Income(response["contributorIncomeSummaryMonthResList"][3]["contributorEarnedAndEstimatedIncome"])
        setT5Income(response["contributorIncomeSummaryMonthResList"][4]["contributorEarnedAndEstimatedIncome"])
        setT6Income(response["contributorIncomeSummaryMonthResList"][5]["contributorEarnedAndEstimatedIncome"])
        setT7Income(response["contributorIncomeSummaryMonthResList"][6]["contributorEarnedAndEstimatedIncome"])
        setT8Income(response["contributorIncomeSummaryMonthResList"][7]["contributorEarnedAndEstimatedIncome"])
        setT9Income(response["contributorIncomeSummaryMonthResList"][8]["contributorEarnedAndEstimatedIncome"])
        setT10Income(response["contributorIncomeSummaryMonthResList"][9]["contributorEarnedAndEstimatedIncome"])
        setT11Income(response["contributorIncomeSummaryMonthResList"][10]["contributorEarnedAndEstimatedIncome"])
        setT12Income(response["contributorIncomeSummaryMonthResList"][11]["contributorEarnedAndEstimatedIncome"])
      })
      .catch((error) => {
        console.log(error)
      })
    await ReportRepository.getContributorIncomesReportData(`/${id}/data`)
      .then((response) => {
        setTIncome(response)
      })
      .catch((error) => {
        console.log(error)
      })

    setIsLoading(false)
  }
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
  const [operatingVehicleRate, setOperatingVehicleRate] = useState(-1);
  const getCount = (filter) => {
    return new Promise(async (resolve, reject) => {
      VehicleRepository.getVehicleCount(`${filter}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        })
    });
  }
  const init = async (uid) => {
    setIsLoading(true)
    await VehicleRepository.getVehicleOverview(`?ownerId=${uid}`)
      .then((response) => {
        setVehicleCountAll(response["totalVehicles"])
        setVehicleCountOnRoute(response["onRouteVehicleCount"])
        setVehicleCountAvailable(response["availableVehicleCount"])
        setVehicleCountAvailableNoDriver(response["statusCount"][1]["statusCount"])
        setVehicleCountMaintenance(response["statusCount"][3]["statusCount"])
        setVehicleCountNeedRepair(response["statusCount"][7]["statusCount"])
        setVehicleCountSedan(response["typeCount"][4]["typeCount"])
        setVehicleCountSUV(response["typeCount"][6]["typeCount"])
        setVehicleCountMinivan(response["typeCount"][3]["typeCount"])
        setVehicleCountMinibus(response["typeCount"][2]["typeCount"])
        setVehicleCountMediumBus(response["typeCount"][1]["typeCount"])
        setVehicleCountLargeBus(response["typeCount"][0]["typeCount"])
        setVehicleCountSleeperBus(response["typeCount"][5]["typeCount"])
      })
      .catch((error) => {
        console.log(error)
      })

    //setIsLoading(false)
  }


  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        setUser(user);
        //init(user.uid)
        init(user.uid);
        initmonthlyIncome(user.uid);
        //setOperatingVehicleRate((vehicleCountOnRoute + vehicleCountAvailable) / vehicleCountAll)
        //console.log(vehicleCountAll)
      })
      .catch((error) => {
        setUser(null);
        console.log(error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.overview}>
      <Header navigation={navigation} title="Overview" />
      <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
        <Card row middle style={styles.margin}>
          <Block flex={1.2} center middle style={{ marginRight: 20 }}>
            {/* <Text light height={43} size={36} spacing={-0.45}>86</Text> */}
            {/* <Text ligth caption center style={{ paddingHorizontal: 16, marginTop: 3 }}>
                OPERATING SCORE
              </Text>  */}
            <ProgressChart
              data={{
                data: [((vehicleCountOnRoute + vehicleCountAvailable) / vehicleCountAll)]
              }}
              width={screenWidth - 30}
              height={100}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={true}
            ></ProgressChart>
          </Block>
          {/* <Block>
            <Text paragraph color="black3">
              All cars are operating well.
              There were 1,233 trips since your last login.
              </Text>
          </Block> */}
          <Block center>
            <Text light size={56} center spacing={-0.45} style={{ marginTop: 5 }}>{(((vehicleCountOnRoute + vehicleCountAvailable) / vehicleCountAll) * 100).toFixed(0)}%</Text>
            <Text ligth caption center style={{ marginTop: 3 }}>
              OPERATING VEHICLES
              </Text>
          </Block>

        </Card>

        <Block row style={[styles.margin, { marginTop: 18 }]}>
          <Card middle style={{ marginRight: 7 }}>
            <Icon vehicle />
            <Text h2 style={{ marginTop: 17 }}>{vehicleCountOnRoute}</Text>
            <Text paragraph color="gray">Vehicles On Route</Text>
          </Card>

          <Card middle style={{ marginLeft: 7 }}>
            <Icon distance />
            <Text h2 style={{ marginTop: 17 }}>{vehicleCountAvailable}</Text>
            <Text paragraph color="gray">Vehicles Available</Text>
          </Card>
        </Block>



        <Card
          title="VEHICLES BY STATUS"
          style={[styles.margin, { marginTop: 18 }]}
        >
          <Block>
            <PieChart
              data={[
                {
                  name: "On route",
                  population: vehicleCountOnRoute,
                  color: "rgba(131, 167, 234, 1)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Available",
                  population: vehicleCountAvailable,
                  color: "#F00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "No driver",
                  population: vehicleCountAvailableNoDriver,
                  color: "blue",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Maintenance",
                  population: vehicleCountMaintenance,
                  color: "#7CFC00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Need repair",
                  population: vehicleCountNeedRepair,
                  color: "#FFFF00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                }
              ]}
              width={screenWidth - 80}
              height={screenWidth - 190}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"

              absolute
            />
          </Block>
        </Card>
        <Card
          title="VEHICLES BY TYPE"
          style={[styles.margin, { marginTop: 18 }]}
        >
          <Block>
            <PieChart
              data={[
                {
                  name: "Sedan",
                  population: vehicleCountSedan,
                  color: "rgba(131, 167, 234, 1)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "SUV",
                  population: vehicleCountSUV,
                  color: "#F00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Minivan",
                  population: vehicleCountMinivan,
                  color: "blue",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Minibus",
                  population: vehicleCountMinibus,
                  color: "#7CFC00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Medium Bus",
                  population: vehicleCountMediumBus,
                  color: "#FFFF00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Large Bus",
                  population: vehicleCountLargeBus,
                  color: "purple",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Sleeper Bus",
                  population: vehicleCountSleeperBus,
                  color: "orange",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                }
              ]}
              width={screenWidth - 80}
              height={screenWidth - 190}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"

              absolute
            />
          </Block>
        </Card>
        <Card title="CURRENT YEAR INCOME" style={[{ marginTop: 18 }]}>
          <Block>
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
          </Block>
          <Block style={[{ marginTop: 18, marginBottom: 18 }]}>
            <LineChart
              data={{
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                datasets: [
                  {
                    //data: [T1Income["earned"] + T1Income["estimated"], T2Income["earned"] + T2Income["estimated"], T3Income["earned"] + T3Income["estimated"], T4Income["earned"] + T4Income["estimated"], T5Income["earned"] + T5Income["estimated"], T6Income["earned"] + T6Income["estimated"], T7Income["earned"] + T7Income["estimated"], T8Income["earned"] + T8Income["estimated"], T9Income["earned"] + T9Income["estimated"], T10Income["earned"] + T10Income["estimated"], T11Income["earned"] + T11Income["estimated"], T12Income["earned"] + T12Income["estimated"]],
                    data: [T1Income["estimated"] / 1000000, T2Income["estimated"] / 1000000, T3Income["estimated"] / 1000000, T4Income["estimated"] / 1000000, T5Income["estimated"] / 1000000, T6Income["estimated"] / 1000000, T7Income["estimated"] / 1000000, T8Income["estimated"] / 1000000, T9Income["estimated"] / 1000000, T10Income["estimated"] / 1000000, T11Income["estimated"] / 1000000, T12Income["estimated"] / 1000000],
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
                { title: 'JANUARY', data: [`Basic Revenue: ${T1Income["estimated"]}`, `Revenue from Trips: ${T1Income["earned"]}`] },
                { title: 'FEBRUARY', data: [`Basic Revenue: ${T2Income["estimated"]}`, `Revenue from Trips: ${T2Income["earned"]}`] },
                { title: 'MARCH', data: [`Basic Revenue: ${T3Income["estimated"]}`, `Revenue from Trips: ${T3Income["earned"]}`] },
                { title: 'APRIL', data: [`Basic Revenue: ${T4Income["estimated"]}`, `Revenue from Trips: ${T4Income["earned"]}`] },
                { title: 'MAY', data: [`Basic Revenue: ${T5Income["estimated"]}`, `Revenue from Trips: ${T5Income["earned"]}`] },
                { title: 'JUNE', data: [`Basic Revenue: ${T6Income["estimated"]}`, `Revenue from Trips: ${T6Income["earned"]}`] },
                { title: 'JULY', data: [`Basic Revenue: ${T7Income["estimated"]}`, `Revenue from Trips: ${T7Income["earned"]}`] },
                { title: 'AUGUST', data: [`Basic Revenue: ${T8Income["estimated"]}`, `Revenue from Trips: ${T8Income["earned"]}`] },
                { title: 'SEPTEMBER', data: [`Basic Revenue: ${T9Income["estimated"]}`, `Revenue from Trips: ${T9Income["earned"]}`] },
                { title: 'OCTOBER', data: [`Basic Revenue: ${T10Income["estimated"]}`, `Revenue from Trips: ${T10Income["earned"]}`] },
                { title: 'NOVEMBER', data: [`Basic Revenue: ${T11Income["estimated"]}`, `Revenue from Trips: ${T11Income["earned"]}`] },
                { title: 'DECEMBER', data: [`Basic Revenue: ${T12Income["estimated"]}`, `Revenue from Trips: ${T12Income["earned"]}`] },
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
              data={TIncome["contributorIncomesDetails"]}
              renderItem={({ item, index }) => <>
                <Text style={styles.sectionHeader}>Contract Id: {item.contractId}</Text>
                <Text style={styles.item}>Vehicle Id: {item.vehicleId}</Text>
                <Text style={styles.item}>Date: {item.date}</Text>
                <Text style={styles.item}>Value: {item.value}</Text>

              </>}
            />
          </Block>
        </Card>

      </ScrollView>
      <Loader isAnimate={isLoading} />
    </SafeAreaView>
  );
};

export default OverviewScreen;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    width: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
});
