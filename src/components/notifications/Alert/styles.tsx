import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import colors from "src/config/colors";
import fonts from "src/config/fonts";
import styled, { css } from "styled-components";

const Flex = `
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export const AlertOverlay = styled.View`
	${Flex};
	/* width: 100%; */
	/* height: 100%; */
	position: absolute;
	height: 100%;
	width: 100%;
	flex: 1;
	z-index: 20;
	/* top: 0; */
	background-color: rgba(0,0,0,.5);
	/* flex: 1; */
`
export const AlertContainer = styled.View`
	${Flex};
	width: 90%;
	height: 40%;
	justify-content: space-between;
	background-color: rgba(255,255,255,.9);
	border-radius: 5px;
	padding: 15px;
`
export const AlertText = styled.Text`
	${Flex};
	width: 100%;
	text-align: center;
	font-size: ${RFValue(13)}px;
	font-weight: bold;
	color: ${colors.black};
	padding: 10px;
	font-family: ${fonts.text};
`

export const IconContainer = styled.Pressable`
	/* padding: 17px 22px; */
	/* background-color: ${colors.secondary_lighter}; */
	margin: 10px;
	margin-bottom: 0;
	width: 100%;
	${Flex};
`

export const BottomMenu = styled.View`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
`

export const ButtonText = styled.Text`
	/* display: flex;
	flex-direction: row;
	justify-content: space-between; */
	width: 45%;
	background-color: ${colors.primary_darker};
	/* background-color: ${colors.white}; */
	text-align: center;
	font-size: ${RFValue(12)}px;
	font-weight: bold;
	color: ${colors.white};
	padding: 15px 25px;
	border-radius: 5px;
	font-family: ${fonts.primary};
`
