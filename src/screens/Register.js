import React from 'react';
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from 'react-native';
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import {ThemeProvider} from '@react-navigation/native';
import * as theme from '../constants/theme';

const {height} = Dimensions.get('window');

const Register = ({navigation}) => {
  return (
    <ScrollView>
      <Block center middle>
        <Block middle>
          <Image
            source={require('../assets/images/Base/Logo.png')}
            style={{height: 70, width: 102}}
          />
        </Block>

        <Block flex={2.5} center>
          <Block center>
            <Text
              h3
              // color="#2E384D"

              // height={32}
              // spacing={0}
              // weight={'300'}
              style={{marginBottom: 6}}>
              Get Started for free
            </Text>

            <Text color="black3" paragraph>
              Free forever, No credit card needed
            </Text>
            <Block row space="between" style={{marginHorizontal: 25}}>
              <Block center middle style={{padding: 20}}>
                <Text bold>Administrator</Text>
                <Text>Full access to all settings</Text>
              </Block>
              <Block center middle style={{padding: 20}}>
                <Text bold>Operator</Text>
                <Text>Service desk and chat pe rmission</Text>
              </Block>
            </Block>
            <Block center flex={0} style={{marginTop: 40}}>
              <Input marginBottom={20} label="Full Name" full email />

              <Input marginBottom={20} label="Email Address" full />

              <Input marginBottom={25} label="Password" password full />

              <Button
                onPress={() => navigation.navigate('Overview')}
                full
                style={{marginBottom: 10}}>
                <Text button>Create Account</Text>
              </Button>
              <Text color="gray" paragraph>
                have an account?
                <Text
                  height={18}
                  color="blue"
                  onPress={() => navigation.navigate('Login')}>
                  Sign in
                </Text>
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  inactive: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 5,
  },

  active: {
    borderWidth: 1,
    borderColor: theme.colors.blue,
    borderRadius: 5,
  },
});
