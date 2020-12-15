import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, PixelRatio, Switch } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

export default function ModalCountryPicker(props) {
  const [countryCode, setCountryCode] = useState("IN");
  const [countryCallCode, setCountryCallCode] = useState(91);
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [withEmoji, setWithEmoji] = useState(true);
  const [withFilter, setWithFilter] = useState(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState(false);
  const [withCallingCode, setWithCallingCode] = useState(false);

  useEffect(() => {
    props.selectCountryCode(countryCallCode);

  }, []);

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCountry(country);
    setCountryCallCode(country.callingCode[0]);
    props.selectCountryCode(country.name);
  };
  return (
    <View>
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect,
        }}
        visible={props.showPhikerModal}
        onClose={() => props.onClose()}
      />
    </View>
  );
}
