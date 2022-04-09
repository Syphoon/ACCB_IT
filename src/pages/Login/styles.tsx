import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';

const Flex = `
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export const App = styled.SafeAreaView`
	background-color: ${colors.primary};
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
	width: 100px;
	height: 100px;
`
export const Subtitle = styled.Text`
	text-align: center;
	width: 100%;
	padding: 0 10px;
	font-family: ${fonts.text};
`

export const InputContainer = styled.View`
	width: 100%;
	${Flex};
	justify-content: space-between !important;
	margin: 10px 0;
`

export const Input = styled.TextInput`
	width: 80%;
	font-family: ${fonts.text};
	/* text-indent: 10px; */
	padding: 10px;
	border-radius: 5px;
	margin: 10px 0;
	background-color: ${colors.white};
	color: ${colors.gray};
`
export const Button = styled.Text`
	width: 100%;
	padding: 2em;
	font-family: ${fonts.primary};
	font-size: 1.5em;
`

export const TopMenu = styled.View`
	position: absolute;
	top: 10px;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`
export const Icon = styled.Image`
	width: 50px;
	height: 50px;
	margin: 0 10px;
	/* background-color: ${colors.white}; */
`
