import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const Flex = `
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export const InputContainer = styled.View`
	width: 100%;
	${Flex};
	justify-content: space-between !important;
	margin: 20px 0;
`


export const App = styled.SafeAreaView`
	/* background-color: ${colors.primary}; */
	${Flex}
	flex: 1;
	position: relative;
`
export const Container = styled.View`
	${Flex}
	position: relative;
	width: 100%;
`
export const Logo = styled.Image`
	width: 30%;
	height: 30%;
`
export const Subtitle = styled.Text`
	text-align: center;
	width: 100%;
	padding: 0 10px;
	font-weight: bold;
	font-family: ${fonts.text};
	color: ${colors.white};
	font-size: ${RFValue(16)}px;
`

export const ButtonContainer = styled.Pressable`
	width: 100%;
	/* padding: 2em; */
	font-family: ${fonts.primary};
	/* font-size: 1.5em; */
	${Flex}
`

export const ButtonText = styled.Text`
	text-align: center;
	border-radius: 5px;
	background-color: ${colors.white};
	align-items: center;
	padding: 13px 15px;
	width: 80%;
	/* font-family: ${fonts.primary}; */
	font-weight: bold;
	font-size: ${RFValue(15)}px;
	elevation: 10;
	color: ${colors.black};
`

export const IconContainer = styled.Pressable`
	/* padding: 17px 22px; */
	background-color: ${colors.secondary_lighter};
	margin: 0 5px;
	elevation: 3;
	${Flex}
`

export const TopMenu = styled.View`
	position: absolute;
	top: 10px;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	padding-right: 10px;
`
export const Icon = styled.Image`
	width: 50px;
	height: 50px;
	margin: 0 10px;
	/* background-color: ${colors.white}; */
`
