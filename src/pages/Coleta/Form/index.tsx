import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Gradient from 'src/components/Gradient';
import colors from 'src/config/colors';
import { BottomMenu, ButtonText, Container,  IconContainer,  IconText,  Legend, Logo, Product, ProductScroll, TopMenu } from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {FlatList, Pressable, Text, TouchableNativeFeedback, View} from 'react-native';
import InputWithIconComponent from 'src/components/InputWithIcon';

const accbLogo = "../../../assets/logos/accb.png";
const uescLogo = "../../../assets/logos/uesc.png";


const Coleta: React.FC = () => {

	const navigation = useNavigation();
	const [price1, setPrice1] = useState("");
	const [price2, setPrice2] = useState("");
	const [price3, setPrice3] = useState("");
	const [price4, setPrice4] = useState("");
	const [price5, setPrice5] = useState("");

	const ColetaContent = (
		<>
			<TopMenu >
				<Container>
					<IconContainer onPress={() => navigation.goBack()}>
						<Icon
							color={'rgba(255,255,255,1)'}
							// color={colors.secondary_lighter}
							name={'arrow-left'}
							size={20}
						/>
						{/* <IconText> Voltar </IconText> */}
					</IconContainer>
				</Container>
				<Container style={{justifyContent: "flex-end"}}>
					<Logo source={require(uescLogo)} />
					<Logo source={require(accbLogo)} />
				</Container>
			</TopMenu>
			<Legend>
				Você está coletando o produto produto.name no estabelecimento <Text style={{ fontWeight: 'bold' }}>{'data.estabelecimento_nome'}.</Text> Preencha os dados e pressione salvar para continuar com a coleta.
			</Legend>
			<ProductScroll
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%"
				}}>
				<InputWithIconComponent type={"numeric"} value={price1} setValue={setPrice1} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price2} setValue={setPrice2} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price3} setValue={setPrice3} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price4} setValue={setPrice4} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price5} setValue={setPrice5} icon={"money"} color={"#fff"} placeholder={"00,00"} />
			</ProductScroll>
			<BottomMenu>
				<TouchableNativeFeedback style={{"elevation": 10}} onPress={() => navigation.goBack()}>
					<ButtonText>
						Cancelar
					</ButtonText>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={() => {}} style={{"elevation": 10}}>
					<ButtonText>
						Salvar Coleta
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
