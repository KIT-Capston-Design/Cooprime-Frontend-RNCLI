import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default function Input({
  placeholder,
  keyboardType,
  secureTextEntry,
  style,
  clearMode,
  onChangeText,
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={style}
        selectionColor="#292929"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ? keyboardType : "default"}
        autoCapitalize="none"
        autoCorrect={false}
        allowFontScaling={false}
        placeholderTextColor="#A0A0A0"
        placeholder={placeholder}
        clearButtonMode={clearMode ? "while-editing" : "never"}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eeeeee",
    // alignItems: "center",
    justifyContent: "center",
    width: width * 0.85,
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    marginVertical: height * 0.004,
    borderRadius: 4,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#D3D3D3",
  },
});
