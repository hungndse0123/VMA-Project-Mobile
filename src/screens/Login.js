import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';

const {height} = Dimensions.get('window');

const Login = ({navigation}) => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={height * 0.3}
      enabled
      behavior="height">
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
              Sign in to VMA
            </Text>

            <Text color="black3" paragraph>
              Please enter your credentials to proceed
            </Text>
            <Block center flex={0} style={{marginTop: 40}}>
              <Input marginBottom={20} label="Phone number" full number />

              <Input
                marginBottom={25}
                label="Password"
                password
                full
                rightLabel={
                  <Text
                    color="gray"
                    paragraph
                    onPress={() => navigation.navigate('Forgot')}>
                    Forgot password?
                  </Text>
                }
              />

              <Button
                onPress={() => navigation.navigate('Overview')}
                full
                style={{marginBottom: 10}}>
                <Text button>Sign In</Text>
              </Button>
              <Text color="gray" paragraph>
                Don't have an account?
                <Text
                  height={18}
                  color="blue"
                  onPress={() => navigation.navigate('Register')}>
                  Sign up
                </Text>
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </KeyboardAvoidingView>
  );
};

export default Login;
