// import React, {Component, useState } from 'react';
// import {
//   Image,
//   KeyboardAvoidingView,
//   ScrollView,
//   StatusBar,
//   Dimensions,
// } from 'react-native';
// import Block from '../components/Block';
// import Text from '../components/Text';
// import Input from '../components/Input';
// import Button from '../components/Button';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// const {height} = Dimensions.get('window');

// class Login extends Component {

//   render() {

//     const { navigation } = this.props;

//     return (
//       <KeyboardAwareScrollView
//         enabled
//         behavior="padding"
//         keyboardVerticalOffset={height * 0.2}
//         style={{ marginVertical: 40 }} showsVerticalScrollIndicator={false}
//       >
//         <Block center middle>
//           <Block middle>
//             <Image
//               source={require('../assets/images/Base/Logo.png')}
//               style={{ height: 70, width: 102 }}
//             />
//           </Block>
//           <Block flex={2.5} center>
//             <Text h3 style={{ marginTop: 44, marginBottom: 6 }}>
//               Sign in to VMA
//             </Text>
//             <Text paragraph color="black3">
//               Please enter your credentials to proceed.
//             </Text>
//             <Block center style={{ marginTop: 44 }}>
//               <Input
//                 full
//                 phone
//                 label="Phone number"
//                 style={{ marginBottom: 25 }}
//               />
//               <Input
//                 full
//                 password
//                 label="Password"
//                 style={{ marginBottom: 25 }}
//                 rightLabel={
//                   <Text
//                     paragraph
//                     color="gray"
//                     onPress={() => navigation.navigate('Forgot')}
//                   >
//                     Forgot password?
//                   </Text>
//                 }
//               />

//               <Button
//                 full
//                 style={{ marginBottom: 12 }}
//                 onPress={() => signInWithPhoneNumber('+84 769-969-167')}
//               >
//                 <Text button>Sign in</Text>
//               </Button>
//               <Text paragraph color="gray">
//                 Don't have an account? <Text
//                   height={18}
//                   color="blue"
//                   onPress={() => navigation.navigate('Register')}>
//                    Sign up
//                 </Text>
//               </Text>
//             </Block>
//           </Block>
//         </Block>
//       </KeyboardAwareScrollView>
//     )
//   }
// }

// export default Login;
import React, { useState, useEffect } from "react";
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    Dimensions,
    StyleSheet,
    Alert,
    View,
    TextInput,
} from 'react-native';
import Block from '../components/Block';
import Text from '../components/Text';
import Input from '../components/Input';
import Button from '../components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { StyleSheet, View, Alert } from "react-native";
import { signInWithPhoneNumber } from "../services/FireAuthHelper";
import PhoneNoInput from '../components/PhoneNoInput';
import Loader from '../components/Loader';

const { height } = Dimensions.get('window');

const Login = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [clearInput, setClearInput] = useState(false);

    const [isLoading, setIsLoading] = useState(false); //For Loader Hide/Show

    useEffect(() => {
        setClearInput(false);
    }, []);

    /**
    * @description Function to Validate Phone Number.
    * @param null.
    */
    const validatePhoneNumber = () => {
        var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
        console.log("test mob ------------------- ", phoneNumber);
        return regexp.test(phoneNumber);
    };

    /**
    * @description Function to Login with Phone Number.
    * @param null.
    */
    const handleSendCode = async () => {
        try {
            // Request to send OTP
            if (validatePhoneNumber) {
                setIsLoading(true);
                signInWithPhoneNumber(phoneNumber)
                    .then((result) => {
                        setClearInput(true);
                        setIsLoading(false);
                        navigation.navigate("PhoneOTP", {
                            confirmResult: result,
                            phoneNumber: phoneNumber,
                        });
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        alert(error.message);
                    });
            } else {
                alert("Invalid Phone Number");
            }
        } catch (error) {
            console.log("Erorrrrrr    -------------- ", error);
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
        //             <Title>Login</Title>
        //         </Body>
        //         <Right />
        //     </Header>
        //     <Content>
        //         <View style={{ marginTop: '10%', width: '80%', alignSelf: 'center' }}>
        //             <PhoneNoInput
        //                 getInputvalue={(value) => setPhoneNumber(value)}
        //                 inputValueClean={clearInput}
        //             />
        //         </View>

        //         <Button rounded style={styles.button} onPress={handleSendCode}>
        //             <Text> Send OTP </Text>
        //         </Button>
        //     </Content>
        //     <Loader isAnimate={isLoading} />
        // </Container>

        <KeyboardAwareScrollView
            enabled
            behavior="padding"
            keyboardVerticalOffset={height * 0.2}
            style={{ marginVertical: 200 }} showsVerticalScrollIndicator={false}
            center
        >
            <Image
                source={require('../assets/images/Base/Logo.png')}
                //style={{ height: height }}
                style={{ height: 70, width: 102, alignSelf: "center" }}
            />
            <Loader isAnimate={isLoading} />
        </KeyboardAwareScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        width: 200,
        alignSelf: "center",
        marginBottom: 20,
        marginTop: '10%'
    },
});
