import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export default function Button({
  onLabel = false,
  label,
  style,
  color,
  onPress,
}) {
  return (
    <TouchableOpacity style={[styles.btnStyle, style]} onPress={onPress}>
      {onLabel ? (
        <Text style={{ color: color ? color : "#FFFFFF" }}>{label}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnStyle: {
    width: 100,
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3796EF",
  },
});
