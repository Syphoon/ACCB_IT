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
	padding: 10px 20px;
	background-color: ${colors.secondary_lighter};
	margin: 0 5px;
	elevation: 3;
	${Flex};
	border-radius: 5px;
`

export const IconText = styled.Text`
	font-family: ${fonts.primary};
	color: ${colors.white};
	font-size: ${RFValue(14)}px;
	margin: 0 10px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
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

export const Product = styled.Text`
	elevation: 10;
	width: 40%;
	margin: 10px;
	background-color: ${colors.primary_darker};
	text-align: center;
	font-size: ${RFValue(12)}px;
	font-weight: bold;
	color: ${colors.white};
	padding: 15px 25px;
	border-radius: 5px;
	font-family: ${fonts.primary};
`

export const ProductWrapper = styled.ScrollView`
	height: 100%;
	justify-content: center;
	align-content: center;
	align-items: center;
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
`
export const ProductScroll = styled.ScrollView`
	/* max-height: 60%; */
	width: 100%;
	flex: 2;
`

export const BottomMenu = styled.View`
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
`

export const ButtonText = styled.Text`
	display: flex;
	flex-direction: column;
	width: 40%;
	margin: 10px 0;
	background-color: rgba(0,0,0,.2);
	/* background-color: ${colors.white}; */
	text-align: center;
	font-size: ${RFValue(12)}px;
	font-weight: bold;
	color: ${colors.white};
	padding: 15px 25px;
	border-radius: 5px;
	font-family: ${fonts.primary};
`
