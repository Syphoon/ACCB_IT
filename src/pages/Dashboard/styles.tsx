import styled, {css} from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const Flex = `
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export const IconContainer = styled.Pressable`
	/* padding: 17px 22px; */
	background-color: ${colors.secondary_lighter};
	margin: 0 5px;
	elevation: 3;
	${Flex};
`

export const TopMenu = styled.View`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	padding: 10px;
	margin-top: 10px;
`

export const Container = styled.View`
	${Flex};
	flex-direction: row !important;
	justify-content: flex-start;
	width: 50%;
`

export const Legend = styled.Text`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	/* background-color: ${colors.primary}; */
	background-color: rgba(0,0,0,.2);
	text-align: center;
	font-size: ${RFValue(14)}px;
	font-weight: bold;
	color: ${colors.white};
	padding: 20px;
	font-family: ${fonts.text};
	margin: ${RFValue(25)}px;
`
export const Logo = styled.Image`
	width: 55px;
	height: 55px;
`
export const SelectContainer = styled.View`
	${Flex};
	flex-direction: row !important;
	justify-content: space-between;
	width: 100%;
	padding: 0 20px;
`

// Listagem

export const ColetaContainer = styled.ScrollView`
	width: 100%;
	padding: 0 15px;
	margin-top: 10px;
	margin-bottom: 10px;
	elevation: 40;
`

export const ColetaItem = styled.View`
	width: 100%;
	background-color: ${colors.terciary};
	/* background-color: ${colors.terciary}; */
	padding: 10px;
	border-radius: 5px;
	margin: 5px 0;
	${Flex};
	z-index:  1;
	elevation: 10;
`
export const ColetaValue = styled.Text`
	width: 100%;
	background-color: ${colors.primary_darker};
	text-align: center;
	font-size: ${RFValue(12)}px;
	font-weight: bold;
	color: ${colors.white};
	padding: 5px;
	border-radius: 3px;
	font-family: ${fonts.text};
`

export const CommandsContainer = styled.View`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	/* background-color: ${colors.white}; */
	border-radius: 5px;
	margin: 5px 0;
	width: 100%;
`
export const CommandsIconContainer = styled.View`
	/* background-color: rgba(255,255,255,.2); */
	background-color: ${colors.blue};
	/* padding: 13px 20px; */
	height: 100%;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border: none;
	padding: 13px 20px;

`

export const Commands = styled.Pressable`
	${Flex}
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	margin: 5px 0;
	elevation: 5;
	width: 49%;
	border-radius: 5px;
	background-color: ${colors.primary_darker};
`

export const CommandsValue = styled.Text`
	color: ${colors.white};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/* font-family: ${fonts.primary}; */
	padding-left: 10px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	height: 100%;
	font-size: ${RFValue(12.5)}px;
	width: 100%;
`
