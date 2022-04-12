
import styled from 'styled-components/native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';


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
	font-size: 14.5px;
	font-weight: bold;
	color: ${colors.white};
	padding: 15px;
	font-family: ${fonts.primary};
	background-color: ${colors.primary_darker};
	/* background-color: ${colors.white}; */
	border-radius: 5px;
`

export const DropdownList = styled.ScrollView`
	background-color: ${colors.primary_darker};
	border-radius: 5px;
	bottom: 0;
	flex-grow: 1;
	max-height: 300px;
`

export const DropdownListValue = styled.Text`
	display: flex;
	width: 100%;
	text-align: center;
	font-size: 14px;
	font-weight: bold;
	color: ${colors.white};
	padding: 15px;
	font-family: ${fonts.primary};
	border-bottom-color: rgba(255,255,255,.1);
	border-bottom-width: 1px;
	border-radius: 5px;
`
