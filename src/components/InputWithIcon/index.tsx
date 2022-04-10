import React, { useEffect, useState } from 'react';
import {Input, InputIconContainer, InputWithIcon, } from "./styles"
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import masks from 'src/lib/masks';

interface IInput  {
	icon: string,
	color: string,
	value: any,
	setValue: any,
	placeholder: string,
	secure?: boolean,
	type?: string,
}

const InputWithIconComponent: React.FC<IInput> = ({icon, color, value, setValue, placeholder, secure=false, type="default"}) => {

	const changeValue = (newValue: string) => {
		if(newValue.length > 5)
			return
		setValue(newValue);
	}

	return (
		<InputWithIcon>
			<InputIconContainer>
				<Icon
					color={color}
					name={icon}
					size={25}
				/>
			</InputIconContainer>
			<Input
				keyboardType={type}
				secureTextEntry={secure}
				placeholder={placeholder}
				value={type != "default" ? masks.formatPrice(value) : value}
				onChangeText={type != "default" ? (value) => changeValue(value) : (value) => setValue(value)} />
		</ InputWithIcon>
	);
};

export default InputWithIconComponent;
