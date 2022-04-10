import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Gradient from 'src/components/Gradient';
import colors from 'src/config/colors';
import { BottomMenu, ButtonText, Container,  Legend, Logo, Product, ProductScroll, TopMenu } from './styles';
import {Text, TouchableNativeFeedback } from 'react-native';

const accbLogo = "../../assets/logos/accb.png";
const uescLogo = "../../assets/logos/uesc.png";


const Coleta: React.FC = () => {

	const navigation = useNavigation();

	const coleta = [
		{
			estab: "askodasssp",
		},
		{
			estab: "aasfasfa",
		},
		{
			estab: "askofffffdasp",
		},
		{
			estab: "askodfffaasp",
		},
		{
			estab: "askodasffafasp",
		},
		{
			estab: "askodgasssp",
		},
		{
			estab: "aasfahsfa",
		},
		{
			estab: "askoffaffdasp",
		},
		{
			estab: "askodzffaasp",
		},
		{
			estab: "askodafxfafasp",
		},
		{
			estab: "askofffcfdasp",
		},
		{
			estab: "askodffvaasp",
		},
		{
			estab: "askodaffbafasp",
		},
	]

	const renderItem = ({ item, idx }) => {
		return (
			<TouchableNativeFeedback onPress={() => navigation.navigate("Form", {state: item})}>
				<Product key={item.estab + idx}>
					{item.estab}
				</Product>
			</TouchableNativeFeedback>
		);
	};

	const ColetaContent = (
		<>
			<TopMenu >
				<Container>
					<Logo source={require(uescLogo)} />
					<Logo source={require(accbLogo)} />
				</Container>
				<Container />
			</TopMenu>
			<Legend>
				Você está coletando no estabelecimento <Text style={{ fontWeight: 'bold' }}>{'data.estabelecimento_nome'}.</Text>	Selecione um produto para cadastrar seus preços.
			</Legend>
			<ProductScroll
				contentContainerStyle={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					flexWrap: "wrap",
					width: "100%"
				}}>
				{
					coleta.map((item, idx) => {
						return renderItem({item, idx})
					})
				}
			</ProductScroll>
			<BottomMenu>
				<TouchableNativeFeedback style={{"elevation": 10}} onPress={() => navigation.goBack()}>
					<ButtonText>
						Cancelar
					</ButtonText>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={() => {}} style={{"elevation": 10}}>
					<ButtonText>
						Confirmar Coleta
					</ButtonText>
				</TouchableNativeFeedback>
			</BottomMenu>
		</>
	);

	return (

		<Gradient
		style={{ justifyContent: "flex-start", zIndex: -2 }}
		colors={[colors.primary, colors.primary, colors.secondary_lighter]}
		children={ColetaContent} />

	);
};

export default Coleta;
