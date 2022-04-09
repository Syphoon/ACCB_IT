import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';

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
	width: 35%;
	height: 35%;
`
export const Subtitle = styled.Text`
	text-align: center;
	width: 100%;
	padding: 0 10px;
	font-weight: bold;
	font-family: ${fonts.text};
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
	padding: 10px 15px;
	width: 80%;
	font-family: ${fonts.primary};
	elevation: 10;
`

export const IconContainer = styled.Pressable`
	/* padding: 17px 22px; */
	background-color: ${colors.white};
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
