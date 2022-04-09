import React, { useEffect, useState } from 'react';
import {Input, InputIconContainer, InputWithIcon, } from "./styles"
import Icon from 'react-native-vector-icons/dist/FontAwesome';

interface IInput  {
	icon: string,
	color: string,
	value: any,
	setValue: any,
	placeholder: string,
	secure?:boolean,
}

const InputWithIconComponent: React.FC<IInput> = ({icon, color, value, setValue, placeholder, secure=false}) => {

	return (
		<InputWithIcon>
			<InputIconContainer>
				<Icon
					color={color}
					name={icon}
					size={25}
				/>
			</InputIconContainer>
			<Input secureTextEntry={secure} placeholder={placeholder} value={value} onChangeText={(value) => setValue(value)} />
		</ InputWithIcon>
	);
};

export default InputWithIconComponent;
