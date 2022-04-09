
import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';


const Flex = `
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

export const InputWithIcon = styled.View`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	/* background-color: ${colors.white}; */
	border-radius: 5px;
	elevation: 20;
	border: none;
	margin: 10px 0;
`
export const InputIconContainer = styled.View`
	background-color: ${colors.secondary}aa;
	padding: 13px 20px;
	height: 100%;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border: none;
`

export const Input = styled.TextInput`
	width: 65%;
	font-family: ${fonts.text};
	padding-left: 10px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	/* text-indent: 10px; */
	/* padding: 10px; */
	/* border-radius: 5px; */
	height: 100%;
	/* margin: 10px 0; */
	background-color: ${colors.white};
	color: ${colors.black};
	/* box-shadow: 5px 5px 5px rgba(0,0,0,1); */
	/* border: 4px solid rgba(0,0,0,.2); */
`
