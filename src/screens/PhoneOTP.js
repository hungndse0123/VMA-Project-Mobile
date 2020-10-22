import React, { useState } from "react";
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import Label from '../components/Label';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet, Alert, Dimensions, Image } from "react-native";
import Loader from '../components/Loader';

const SignUpScreen = ({ navigation, route }) => {
    const [OTP, setOTP] = useState("");
    const [isLoading, setIsLoading] = useState(false); //For Loader Hide/Show
    /**
     * @description Function to Verify OTP.
     * @param null.
     */
    const {height} = Dimensions.get('window');
    const handleVerifyCode = () => {
        // Request for OTP verification
        const confirmResult = route.params.confirmResult;
        console.log("-------------Confirm result ---------------- ", confirmResult);
        if (OTP.length == 6) {
            setIsLoading(true);
            confirmResult
                .confirm(OTP)
                .then((user) => {
                    console.log("User in OTP screen :--------- ", user);
                    setOTP("");
                    setIsLoading(false);
                    navigation.navigate("Overview");
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
                    <Block center style={{ marginBottom: 70 , alignSelf: 'center', width: '85%'}}>
                     <Text>OTP</Text>
                         <Input
                             placeholder="Please enter OTP"
                             value={OTP}
                             maxLength={6}
                             full
                             keyboardType={'number-pad'}
                             onChangeText={(text) => setOTP(text)}
                         />
                    </Block>
                      <Button
                        full
                        style={{ marginBottom: 12 }}
                        onPress={handleVerifyCode}
                      >
                        <Text button>Verify</Text>
                      </Button>
                      <Text paragraph color="gray">
                        Don't have an account? <Text
                          height={18}
                          color="blue"
                          onPress={() => navigation.navigate('Register')}>
                           Sign up
                        </Text>
                      </Text>
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
});
