import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';

export const LogoContainer = styled.View`
	margin: 10px 0;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
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
	font-size: 14px;
	font-weight: bold;
	color: ${colors.white};
	padding: 20px;
	font-family: ${fonts.text};
`
export const Logo = styled.Image`
	width: 110px;
	height: 110px;
	/* height: 20%; */
	/* margin: 0 15px; */
`
