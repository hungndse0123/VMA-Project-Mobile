import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import UserRepository from '../repositories/UserRepository';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeProvider } from '@react-navigation/native';
import * as theme from '../constants/theme';
import Loader from '../components/Loader';

const { height } = Dimensions.get('window');

class Register extends Component {
  state = {
    active: null,
    userrole: '',
    isLoading: true
  }
  componentDidMount() {
    this.getRole()
    //console.log(JSON.stringify(this.state.role))

  }

  handleType = id => {
    const { active } = this.state;
    this.setState({ active: active === id ? null : id });
  }

  // storeRole = async (role) => {
  //   try {
  //     //console.log("a" + role);
  //     await AsyncStorage.setItem('@ROLE', role)
  //   } catch (error) {
  //     // Error saving data
  //   }
  // };
  getRole = async () => {
    const { role, userrole } = this.state;
    await UserRepository.getUserrole()
      .then((response) => {
        response.data["roleList"].length === 2 ? this.setState({ userrole: 'BOTH' }) : response.data["roleList"][0]["roleName"] === 'CONTRIBUTOR' ? this.setState({ userrole: 'CONTRIBUTOR' }) : this.setState({ userrole: 'DRIVER' })
      })
      .catch((error) => {
        console.log(error);

      })
    this.setState({ isLoading: false })
  }

  handleRoute = id => {
    // id === 'driver' ? this.storeRole('DRIVER') : this.storeRole('CONTRIBUTOR');
    id === 'driver' ? this.props.navigation.navigate('Driver') : this.props.navigation.navigate('Contributor');
  }

  render() {
    const { navigation } = this.props;
    const { active } = this.state;

    const driverIcon = (
      <Image
        source={require('../assets/images/icons/driver.png')}
        style={{ height: 40, width: 40 }}
      />
    );

    const contributorIcon = (
      <Image
        source={require('../assets/images/icons/contributor.png')}
        style={{ height: 40, width: 40 }}
      />
    );

    const checkIcon = (
      <Image
        source={require('../assets/images/icons/check.png')}
        style={{ height: 18, width: 18 }}
      />
    );

    return (
      <KeyboardAwareScrollView style={{ marginVertical: 40 }} showsVerticalScrollIndicator={false}>
        <Block center middle style={{ marginBottom: 40, marginTop: 20 }}>
          <Image
            source={require('../assets/images/Base/Logo.png')}
            style={{ height: 70, width: 102 }}
          />
        </Block>
        <Block center>
          <Text h3 style={{ marginBottom: 6 }}>
            Role
          </Text>
          <Text paragraph color="black3">
            Choose your role
          </Text>
          <Block row style={{ marginHorizontal: 10, marginTop: 40, }}>
            {this.state.userrole === 'BOTH' ? (<>
              <TouchableWithoutFeedback
                onPress={() => this.handleType('driver')}
                style={active === 'driver' ? styles.activeBorder : null}
              >
                <Block
                  center
                  middle
                  style={[
                    styles.card,
                    { marginRight: 20, },
                    active === 'driver' ? styles.active : null
                  ]}
                >
                  {
                    active === 'driver' ? (
                      <Block center middle style={styles.check}>
                        {checkIcon}
                      </Block>
                    ) : null
                  }
                  <Block center middle style={styles.icon}>
                    {driverIcon}
                  </Block>
                  <Text h4 style={{ marginBottom: 11 }}>Driver</Text>
                  <Text paragraph center color="black3">Login as driver</Text>
                </Block>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  this.handleType('contributor')
                }}
                style={active === 'contributor' ? styles.activeBorder : null}
              >
                <Block
                  center
                  middle
                  style={[
                    styles.card,

                    active === 'contributor' ? styles.active : null
                  ]}
                >
                  {
                    active === 'contributor' ? (
                      <Block center middle style={styles.check}>
                        {checkIcon}
                      </Block>
                    ) : null
                  }
                  <Block center middle style={styles.icon}>
                    {contributorIcon}
                  </Block>
                  <Text h4 style={{ marginBottom: 11 }}>Contributor</Text>
                  <Text paragraph center color="black3">Login as contributor</Text>
                </Block>
              </TouchableWithoutFeedback></>) : this.state.userrole === 'CONTRIBUTOR' ? (<>
                <Block center style={{ width: height - 200 }}>

                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.handleType('contributor')
                    }}
                    style={active === 'contributor' ? styles.activeBorder : null}
                  >
                    <Block
                      center
                      middle
                      style={[
                        styles.card,

                        active === 'contributor' ? styles.active : null
                      ]}
                    >
                      {
                        active === 'contributor' ? (
                          <Block center middle style={styles.check}>
                            {checkIcon}
                          </Block>
                        ) : null
                      }
                      <Block center middle style={styles.icon}>
                        {contributorIcon}
                      </Block>
                      <Text h4 style={{ marginBottom: 11 }}>Contributor</Text>
                      <Text paragraph center color="black3">Login as contributor</Text>
                    </Block>
                  </TouchableWithoutFeedback>
                </Block>
              </>) : this.state.userrole === 'DRIVER' ? (<>
                <Block center style={{ width: height - 200 }}>
                  <TouchableWithoutFeedback
                    onPress={() => this.handleType('driver')}
                    style={active === 'driver' ? styles.activeBorder : null}
                  >
                    <Block
                      center
                      style={[
                        styles.card,

                        active === 'driver' ? styles.active : null
                      ]}
                    >
                      {
                        active === 'driver' ? (
                          <Block center middle style={styles.check}>
                            {checkIcon}
                          </Block>
                        ) : null
                      }
                      <Block center middle style={styles.icon}>
                        {driverIcon}
                      </Block>
                      <Text h4 style={{ marginBottom: 11 }}>Driver</Text>
                      <Text paragraph center color="black3">Login as driver</Text>
                    </Block>
                  </TouchableWithoutFeedback>
                </Block>
              </>) : (<></>)}

          </Block>
          <Block center style={{ marginTop: 25 }}>
            {/* <Input
              full
              label="Full name"
              style={{ marginBottom: 25 }}
            />
            <Input
              full
              email
              label="Email address"
              style={{ marginBottom: 25 }}
            />
            <Input
              full
              password
              label="Password"
              style={{ marginBottom: 25 }}
            /> */}

            <Button
              full
              style={{ marginBottom: 12 }}
              onPress={() => this.handleRoute(active)}
            >
              <Text button>Continue</Text>
            </Button>
          </Block>
        </Block>
        <Loader isAnimate={this.state.isLoading} />
      </KeyboardAwareScrollView>
    )
  }
}

export default Register;

const styles = StyleSheet.create({
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
    marginBottom: 15,
    backgroundColor: theme.colors.lightblue
  },
  check: {
    position: 'absolute',
    right: -9,
    top: -9,
  }
});
