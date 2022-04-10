
import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';
import { RFValue } from 'react-native-responsive-fontsize';


const Flex = `
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export const DropdownContainer = styled.Pressable`
	/* display: flex; */
	/* justify-content: flex-end; */
	/* flex-direction: column; */
	/* background-color: ${colors.white}; */
	margin: 10px 0;
	position: relative;
	width: 47%;
	elevation: 10;
	z-index: 12;
`

export const DropdownValue = styled.Text`
	display: flex;
	width: 100%;
	text-align: center;
	font-size: ${RFValue(14)}px;
	font-weight: bold;
	color: ${colors.white};
	padding: ${RFValue(15)}px;
	font-family: ${fonts.primary};
	background-color: ${colors.primary_darker};
	/* background-color: ${colors.white}; */
	border-radius: 5px;
`

export const DropdownList = styled.ScrollView`
	/* display: flex; */
	/* justify-content: center; */
	/* flex-direction: column; */
	background-color: ${colors.primary_darker};
	/* background-color: ${colors.white}; */
	border-radius: 5px;
	/* position: absolute; */
	elevation: 20;
	/* width: 42%; */
	/* left: 5%; */
	/* top: 38%; */
	bottom: -${RFValue(425)}px;
	flex-grow: 1;
	max-height: 300px;
`

export const DropdownListValue = styled.Text`
	display: flex;
	width: 100%;
	/* background-color: black; */
	text-align: center;
	font-size: ${RFValue(14)}px;
	font-weight: bold;
	color: ${colors.white};
	/* color: ${colors.black}; */
	padding: 15px;
	font-family: ${fonts.primary};
	border-bottom-color: rgba(255,255,255,.1);
	border-bottom-width: 1px;
	border-radius: 5px;
`
