import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions, TextInput
} from "react-native";
// import TextInputMask from "react-native-text-input-mask";
import CountryCodesInput from "./CountryCodesInput";
import ModalCountryPicker from "./ModalCountryPicker";

const { width, height } = Dimensions.get("window");
class PhoneNoInput extends Component {
  constructor() {
    super();
    this.state = {
      valid: "",
      type: "",
      phoneNo: "",
      countryCode: "",
      inputVal: "",
      visibleCountryPicker: false,
    };
  }
  componentDidMount() { }

  UNSAFE_componentWillReceiveProps(props) {
    let setCleanInput = props.inputValueClean;
    if (setCleanInput) {
      this.setState({
        inputVal: "",
      });
    }
  }

  handleOnChange = (inputValue) => {
    // const { countryCode } = this.state;
    // let phoneNo = `${"+"}${countryCode} ${inputValue}`;
    let phoneNo = `${"+"}${"84"} ${inputValue}`;
    this.setState({
      inputVal: inputValue,
    });
    this.props.getInputvalue(phoneNo);
  };

  render() {
    const { countryCode, inputVal, visibleCountryPicker } = this.state;
    return (
      <View style={styles.container}>
        {/* <CountryCodesInput
          selectCountryCode={(code) => this.setState({ countryCode: code })}
        /> */}
        {/* <ModalCountryPicker
          selectCountryCode={(code) => this.setState({ countryCode: code })}
          showPhikerModal={visibleCountryPicker}
          onClose={() => this.setState({ visibleCountryPicker: false })}
        /> */}
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() =>
          //   this.setState({
          //     visibleCountryPicker: true,
          //   })
          // }
          style={{ paddingRight: 7 }}
        >
          {/* <Text style={styles.inputText}>+{countryCode}</Text> */}
          <Text style={styles.inputText}>+{"84"}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <TextInput
            refInput={(ref) => {
              this.input = ref;
            }}
            placeholder={"Enter your phone number"}
            onChangeText={(extracted) => {
              this.handleOnChange(extracted);
              // console.log(formatted); // +1 (123) 456-78-90
              //console.log(extracted); // 1234567890
            }}
            autoFocus={true}
            value={inputVal}
            keyboardType="number-pad"
            // maxLength={10}
            //mask={"([000]) [000] - [0000]"}
            style={styles.inputText}
          />
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    height: 45,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#DADADA",
    alignItems: "center",
    paddingRight: 10,
    paddingLeft: 17,
  },
  inputText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.53)",
  },
});
export default PhoneNoInput;
