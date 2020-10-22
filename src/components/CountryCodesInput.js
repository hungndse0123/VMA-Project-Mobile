import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PhoneInput from "react-native-phone-input";
import axios from "axios";

class CountryCodesInput extends Component {
  constructor() {
    super();
    this.state = {
      countryCode: "1",
    };
  }

  componentDidMount() {
    const { countryCode } = this.state;
    this.props.selectCountryCode(countryCode);
    // this.getGeoInfo();
  }
  getGeoInfo = async () => {
    await axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        let data = response.data;
        this.setState({
          countryCode: data.country_calling_code,
        });
        let slicedValues = data.country_calling_code.slice(1, 3);
        this.props.selectCountryCode(slicedValues);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getCounCode = () => {
    let selectCounCode = this.phone.getCountryCode();
    this.setState({
      countryCode: selectCounCode,
    });
    this.props.selectCountryCode(selectCounCode);
  };

  render() {
    const { countryCode } = this.state;
    return (
      <View>
        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          autoFormat={true}
          onSelectCountry={() => this.getCounCode()}
          value={`${"+"}${countryCode}`}
        />
      </View>
    );
  }
}

let styles = StyleSheet.create({});
export default CountryCodesInput;
