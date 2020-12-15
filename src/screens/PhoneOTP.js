import React, { useState } from "react";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import { checkAuthState } from "../services/FireAuthHelper";
import Label from '../components/Label';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { StyleSheet, Alert, Dimensions, Image, LogBox } from "react-native";
import Loader from '../components/Loader';
import Auth from "@react-native-firebase/auth";
import axios from 'axios';
import UserRepository from '../repositories/UserRepository'

const SignUpScreen = ({ navigation, route }) => {
  const [OTP, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false); //For Loader Hide/Show
  /**
   * @description Function to Verify OTP.
   * @param null.
   */
  const { height } = Dimensions.get('window');

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  // checkAuthState()
  // .then((user) => {
  //   console.log("checkOnAuthStateChanged =>", user);
  //   setOTP("");
  //   setIsLoading(false);
  //   navigation.navigate("Overview");
  // })
  // .catch((error) => {
  //   setIsLoading(false);
  //   console.log("Error while verifying OTP :-- ", error);
  //   setOTP("");
  //   alert(error.message);
  // });
  const updateStatus = (userid) => {
    UserRepository.updateUserStatusByUserId(userid, 'ACTIVE')
  }

  const handleVerifyCode = code => {
    // Request for OTP verification
    Auth().onAuthStateChanged(function (curuser) {
      if (curuser) {
        console.log("currentUser =>", curuser);
        setOTP("");
        setIsLoading(false);
        updateStatus(curuser.uid);
        navigation.navigate("Role");
      } else {


        setOTP(code);
        console.log("Code is", code);
        const confirmResult = route.params.confirmResult;
        //console.log("-------------Confirm result ---------------- ", confirmResult);

        setIsLoading(true);
        if (code.length == 6) {

          confirmResult
            .confirm(code)
            .then((user) => {
              console.log("User in OTP screen :--------- ", user);
              setOTP("");
              setIsLoading(false);
              updateStatus(user.uid);
              navigation.navigate("Role");
            })
            .catch((error) => {
              setIsLoading(false);
              console.log("Error while verifying OTP :-- ", error);
              setOTP("");
              alert(error.message);
            });
        } else {
          alert("Please enter the code in the sms we sent you.");
        }
      }
    }

    )
  };

  return (
    // <Container>
    //     <Header>
    //         <Left>
    //             <Button transparent onPress={() => navigation.goBack()}>
    //                 <Icon name="arrow-back" />
    //             </Button>
    //         </Left>
    //         <Body>
    //             <Title>Verify</Title>
    //         </Body>
    //         <Right />
    //     </Header>
    //     <Content>
    //         <Form>
    //             <Item floatingLabel style={{ margin: 20 }}>
    //                 <Label>OTP</Label>
    //                 <Input
    //                     placeholder="Please enter OTP"
    //                     value={OTP}
    //                     maxLength={6}
    //                     keyboardType={'number-pad'}
    //                     onChangeText={(text) => setOTP(text)}
    //                 />
    //             </Item>

    //         </Form>

    //         <Button rounded style={styles.button} onPress={handleVerifyCode}>
    //             <Text> Verify </Text>
    //         </Button>
    //     </Content>
    //     <Loader isAnimate={isLoading} />
    // </Container>
    <KeyboardAwareScrollView
      enabled
      behavior="padding"
      keyboardVerticalOffset={height * 0.2}
      style={{ marginVertical: 40 }} showsVerticalScrollIndicator={false}
    >
      <Block center middle>
        <Block middle>
          <Image
            source={require('../assets/images/Base/Logo.png')}
            style={{ height: 70, width: 102 }}
          />
        </Block>
        <Block flex={2.5} center>
          <Text h3 style={{ marginTop: 44, marginBottom: 6 }}>
            Sign in to VMA
                    </Text>
          <Text paragraph color="black3">
            Please enter your credentials to proceed.
                    </Text>



          <Block center style={{ marginTop: 70 }}>
            <Block center style={{ marginBottom: 70, alignSelf: 'center', width: '85%' }}>
              <Text>OTP</Text>

              <OTPInputView
                style={{ width: '80%', height: 200 }}
                pinCount={6}
                //onCodeChanged = {code => {setOTP(code) }}
                onCodeFilled={(code) => {

                  handleVerifyCode(code)
                }}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}

              />
            </Block>
          </Block>
        </Block>
      </Block>
      <Loader isAnimate={isLoading} />
    </KeyboardAwareScrollView>
  );

};

export default SignUpScreen;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    width: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});
