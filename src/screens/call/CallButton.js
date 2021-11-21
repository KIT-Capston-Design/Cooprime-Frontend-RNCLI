import React from "react";
import { Animated } from "react-native";

class CallButton extends React.Component {
  state = {
    animation: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.timing(this.state.animation, {
      toValue: 250,
      duration: 2000,
    }).start();
  }

  render() {
    return (
      <Animated.View style={[objectStyles, animationStyles]}></Animated.View>
    );
  }
}
