import React, {Component} from 'react';
import {TextInput} from 'react-native';

const text_input = (props) => {
  const [value, onChangeText] = React.useState(value);

  return (
    <TextInput
      secureTextEntry={props.txt == 'Senha' ? true : false}
      style={props.st}
      placeholderTextColor={'#fff'}
      onChangeText={(value) => onChangeText(value)}
      value={value}
      placeholder={props.txt}
    />
  );
};

export default text_input;
