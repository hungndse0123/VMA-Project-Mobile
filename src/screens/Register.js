import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
} from 'react-native';
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from '../components/Icon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {ThemeProvider} from '@react-navigation/native';
import * as theme from '../constants/theme';

const {height} = Dimensions.get('window');

class Register extends Component {
  state = {
    active: null,
  }

  handleType = id => {
    const { active } = this.state;
    this.setState({ active: active === id ? null : id });
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
            Get started for free
          </Text>
          <Text paragraph color="black3">
            Free forever. No credit card needed.
          </Text>
          <Block row style={{ marginHorizontal: 10, marginTop: 40, }}>
            <TouchableWithoutFeedback
              onPress={() => this.handleType('administrator')}
              style={active === 'administrator' ? styles.activeBorder : null}
            >
              <Block
                center
                middle
                style={[
                  styles.card,
                  { marginRight: 20, },
                  active === 'administrator' ? styles.active : null
                ]}
              >
                {
                  active === 'administrator' ? (
                    <Block center middle style={styles.check}>
                      {checkIcon}
                    </Block>
                  ) : null
                }
                <Block center middle style={styles.icon}>
                  {driverIcon}
                </Block>
                <Text h4 style={{ marginBottom: 11 }}>Driver</Text>
                <Text paragraph center color="black3">Become our driver</Text>
              </Block>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => this.handleType('operator')}
              style={active === 'operator' ? styles.activeBorder : null}
            >
              <Block
                center
                middle
                style={[
                  styles.card,
                  
                  active === 'operator' ? styles.active : null
                ]}
              >
                {
                  active === 'operator' ? (
                    <Block center middle style={styles.check}>
                      {checkIcon}
                    </Block>
                  ) : null
                }
                <Block center middle style={styles.icon}>
                  {contributorIcon}
                </Block>
                <Text h4 style={{ marginBottom: 11 }}>Contributor</Text>
                <Text paragraph center color="black3">Become our contributor</Text>
              </Block>
            </TouchableWithoutFeedback>

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
              onPress={() => navigation.navigate('Overview')}
            >
              <Text button>Continue</Text>
            </Button>
            <Text paragraph color="gray">
              Already have an account? <Text
                height={18}
                color="blue"
                onPress={() => navigation.navigate('Login')}>
                Sign in
              </Text>
            </Text>
          </Block>
        </Block>
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
