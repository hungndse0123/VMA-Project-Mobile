// import React, { Component } from 'react';
// import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import DrawerNavigator from '../navigation/DrawerNavigator';

// import Block from '../components/Block';
// import Text from '../components/Text';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import Card from '../components/Card';
// import Icon from '../components/Icon';
// import Label from '../components/Label';
// import Header from '../components/Header';
// import menu from '../assets/images/icons/menu.png';
// import * as theme from '../constants/theme';


// const styles = StyleSheet.create({
//   overview: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: theme.colors.white,
//   },
//   margin: {
//     marginHorizontal: 25,
//   },
//   driver: {
//     marginBottom: 11,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   }
// });

// class Overview extends Component {
//   static navigationOptions = ({ navigation }) => ({
//     headerLeftContainerStyle: {
//       paddingLeft: 24
//     },
//     headerRightContainerStyle: {
//       paddingRight: 24
//     },
//     headerLeft: (
//       <TouchableOpacity onPress={() => navigation.openDrawer()}><Icon menu /></TouchableOpacity>
//     ),
//     headerRight: (
//       <TouchableOpacity><Icon notification /></TouchableOpacity>
//     ),
//     headerTitle: (
//       <Block row middle><Text h4>Overview</Text></Block>
//     )
//   });

//   render() {
//     return (
//       <SafeAreaView style={styles.overview}>
//         <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
//           <Card row middle style={styles.margin}>
//             <Block flex={1.2} center middle style={{ marginRight: 20 }}>
//               <Text light height={43} size={36} spacing={-0.45}>86</Text>
//               <Text ligth caption center style={{ paddingHorizontal: 16, marginTop: 3 }}>
//                 OPERATING SCORE
//               </Text>
//             </Block>
//             <Block>
//               <Text paragraph color="black3">
//                 All cars are operating well.
//                 There were 1,233 trips since your last login.
//               </Text>
//             </Block>
//           </Card>

//           <Block row style={[styles.margin, { marginTop: 18 }]}>
//             <Card middle style={{ marginRight: 7 }}>
//               <Icon vehicle />
//               <Text h2 style={{ marginTop: 17 }}>1,428</Text>
//               <Text paragraph color="gray">Vehicles on track</Text>
//             </Card>

//             <Card middle style={{ marginLeft: 7 }}>
//               <Icon distance />
//               <Text h2 style={{ marginTop: 17 }}>158.3</Text>
//               <Text paragraph color="gray">Distance driven</Text>
//             </Card>
//           </Block>

//           <Card
//             title="TODAY'S TRIPS"
//             style={[styles.margin, { marginTop: 18 }]}
//           >
//             <Block row right>
//               <Block flex={2} row center right>
//                 <Label blue />
//                 <Text paragraph color="gray">Today</Text>
//               </Block>
//               <Block row center right>
//                 <Label purple />
//                 <Text paragraph color="gray">Yesterday</Text>
//               </Block>
//             </Block>
//             <Block>
//               <Text>Chart</Text>
//             </Block>
//           </Card>

//           <Card
//             title="TOP DRIVERS"
//             style={[styles.margin, { marginTop: 18 }]}
//           >
//             <Block style={styles.driver}>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <Block row center>
//                   <Block>
//                     <Image
//                       style={styles.avatar}
//                       source={{ uri: 'https://images.unsplash.com/photo-1506244856291-8910ea843e81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
//                     />
//                   </Block>
//                   <Block flex={2}>
//                     <Text h4>Grand Tesoro</Text>
//                     <Text paragraph color="gray">Chevrolet Bolt</Text>
//                   </Block>
//                   <Block>
//                     <Text paragraph right color="black">$6,432</Text>
//                     <Text paragraph right color="gray">1,232 miles</Text>
//                   </Block>
//                 </Block>
//               </TouchableOpacity>
//             </Block>
//             <Block style={styles.driver}>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <Block row center>
//                   <Block>
//                     <Image
//                       style={styles.avatar}
//                       source={{ uri: 'https://images.unsplash.com/photo-1521657249896-063c0c611fe5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
//                     />
//                   </Block>
//                   <Block flex={2}>
//                     <Text h4>Invision App</Text>
//                     <Text paragraph color="gray">Tesla Model X</Text>
//                   </Block>
//                   <Block>
//                     <Text paragraph right color="black">$6,432</Text>
//                     <Text paragraph right color="gray">1,232 miles</Text>
//                   </Block>
//                 </Block>
//               </TouchableOpacity>
//             </Block>
//             <Block style={styles.driver}>
//               <TouchableOpacity activeOpacity={0.8}>
//                 <Block row center>
//                   <Block>
//                     <Image
//                       style={styles.avatar}
//                       source={{ uri: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
//                     />
//                   </Block>
//                   <Block flex={2}>
//                     <Text h4>React UI Kit</Text>
//                     <Text paragraph color="gray">Volvo Intellisafe</Text>
//                   </Block>
//                   <Block>
//                     <Text paragraph right color="black">$6,432</Text>
//                     <Text paragraph right color="gray">1,232 miles</Text>
//                   </Block>
//                 </Block>
//               </TouchableOpacity>
//             </Block>
//           </Card>


//           <Card
//             title="TRIPS BY TYPE"
//             style={[styles.margin, { marginTop: 18 }]}
//           >
//             <Block>
//               <Text>Chart</Text>
//             </Block>
//             <Block row space="between" style={{ marginTop: 25 }}>
//               <Block>
//                 <Text h2 light>1,744</Text>
//                 <Block row center>
//                   <Label blue />
//                   <Text paragraph color="gray">Confort</Text>
//                 </Block>
//               </Block>
//               <Block>
//                 <Text h2 light>2,312</Text>
//                 <Block row center>
//                   <Label purple />
//                   <Text paragraph color="gray">Premium</Text>
//                 </Block>
//               </Block>
//             </Block>
//           </Card>
//         </ScrollView>

//       </SafeAreaView>
//     )
//   }
// }

// export default Overview;
import React, { useState, useEffect } from "react";

import { TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, BackHandler } from "react-native";
import { signOutUser, getCurrentUser } from "../services/FireAuthHelper";
import VehicleRepository from "../repositories/VehicleRepository";
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
  const [vehicleCountCar, setVehicleCountCar] = useState(-1);
  const [vehicleCountCoach, setVehicleCountCoach] = useState(-1);
  const [vehicleCountTruck, setVehicleCountTruck] = useState(-1);
  const [vehicleCountSpecialized, setVehicleCountSpecialized] = useState(-1);
  const [vehicleCount45Bus, setVehicleCount45Bus] = useState(-1);
  const data = {
    // labels: ["Swim"], // optional
    data: [0.8]
  };
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
    await getCount(`?ownerId=${uid}`)
      .then((response) => {
        setVehicleCountAll(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleStatus=ON_ROUTE&viewOption=1`)
      .then((response) => {
        setVehicleCountOnRoute(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleStatus=AVAILABLE&viewOption=1`)
      .then((response) => {
        setVehicleCountAvailable(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleStatus=AVAILABLE_NO_DRIVER&viewOption=1`)
      .then((response) => {
        setVehicleCountAvailableNoDriver(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleStatus=MAINTENANCE&viewOption=1`)
      .then((response) => {
        setVehicleCountMaintenance(response)
      })
      .catch((error) => {
        console.log(error)
      })
    // await getCount(`?ownerId=${uid}&vehicleStatus=PENDING_APPROVAL&viewOption=1`)
    //   .then((response) => {
    //     setVehicleCountPendingApproval(response)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    await getCount(`?ownerId=${uid}&vehicleStatus=NEED_REPAIR&viewOption=1`)
      .then((response) => {
        setVehicleCountNeedRepair(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleTypeId=1`)
      .then((response) => {
        setVehicleCountCar(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleTypeId=2`)
      .then((response) => {
        setVehicleCountCoach(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleTypeId=3`)
      .then((response) => {
        setVehicleCountTruck(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleTypeId=4`)
      .then((response) => {
        setVehicleCountSpecialized(response)
      })
      .catch((error) => {
        console.log(error)
      })
    await getCount(`?ownerId=${uid}&vehicleTypeId=5`)
      .then((response) => {
        setVehicleCount45Bus(response)
      })
      .catch((error) => {
        console.log(error)
      })

    setIsLoading(false)
  }


  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        setUser(user);
        //init(user.uid)
        init(user.uid);
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
                // labels: ["Swim"], // optional
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
            <Text h2 style={{ marginTop: 17 }}>{vehicleCountAvailable + vehicleCountAvailableNoDriver}</Text>
            <Text paragraph color="gray">Vehicles Available</Text>
          </Card>
        </Block>

        {/* <Card
          title="TODAY'S TRIPS"
          style={[styles.margin, { marginTop: 18 }]}
        >
          <Block row right>
            <Block flex={2} row center right>
              <Label blue />
              <Text paragraph color="gray">Today</Text>
            </Block>
            <Block row center right>
              <Label purple />
              <Text paragraph color="gray">Yesterday</Text>
            </Block>
          </Block>
          <Block>
            <Text>Chart</Text>
          </Block>
        </Card>

        <Card
          title="TOP DRIVERS"
          style={[styles.margin, { marginTop: 18 }]}
        >
          <Block style={styles.driver}>
            <TouchableOpacity activeOpacity={0.8}>
              <Block row center>
                <Block>
                  <Image
                    style={styles.avatar}
                    source={{ uri: 'https://images.unsplash.com/photo-1506244856291-8910ea843e81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
                  />
                </Block>
                <Block flex={2}>
                  <Text h4>Grand Tesoro</Text>
                  <Text paragraph color="gray">Chevrolet Bolt</Text>
                </Block>
                <Block>
                  <Text paragraph right color="black">$6,432</Text>
                  <Text paragraph right color="gray">1,232 miles</Text>
                </Block>
              </Block>
            </TouchableOpacity>
          </Block>
          <Block style={styles.driver}>
            <TouchableOpacity activeOpacity={0.8}>
              <Block row center>
                <Block>
                  <Image
                    style={styles.avatar}
                    source={{ uri: 'https://images.unsplash.com/photo-1521657249896-063c0c611fe5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
                  />
                </Block>
                <Block flex={2}>
                  <Text h4>Invision App</Text>
                  <Text paragraph color="gray">Tesla Model X</Text>
                </Block>
                <Block>
                  <Text paragraph right color="black">$6,432</Text>
                  <Text paragraph right color="gray">1,232 miles</Text>
                </Block>
              </Block>
            </TouchableOpacity>
          </Block>
          <Block style={styles.driver}>
            <TouchableOpacity activeOpacity={0.8}>
              <Block row center>
                <Block>
                  <Image
                    style={styles.avatar}
                    source={{ uri: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' }}
                  />
                </Block>
                <Block flex={2}>
                  <Text h4>React UI Kit</Text>
                  <Text paragraph color="gray">Volvo Intellisafe</Text>
                </Block>
                <Block>
                  <Text paragraph right color="black">$6,432</Text>
                  <Text paragraph right color="gray">1,232 miles</Text>
                </Block>
              </Block>
            </TouchableOpacity>
          </Block>
        </Card> */}


        <Card
          title="VEHICLES BY STATUS"
          style={[styles.margin, { marginTop: 18 }]}
        >
          {/* <Block>
            <Text>Chart</Text>
          </Block>
          <Block row space="between" style={{ marginTop: 25 }}>
            <Block>
              <Text h2 light>1,744</Text>
              <Block row center>
                <Label blue />
                <Text paragraph color="gray">Confort</Text>
              </Block>
            </Block>
            <Block>
              <Text h2 light>2,312</Text>
              <Block row center>
                <Label purple />
                <Text paragraph color="gray">Premium</Text>
              </Block>
            </Block>
          </Block> */}
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
                  name: "Car",
                  population: vehicleCountCar,
                  color: "rgba(131, 167, 234, 1)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Coach",
                  population: vehicleCountCoach,
                  color: "#F00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Truck",
                  population: vehicleCountTruck,
                  color: "blue",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "Specialized",
                  population: vehicleCountSpecialized,
                  color: "#7CFC00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 10
                },
                {
                  name: "45 seats Bus",
                  population: vehicleCount45Bus,
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
