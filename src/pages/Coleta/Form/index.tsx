import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import Gradient from 'src/components/Gradient';
import colors from 'src/config/colors';
import { BottomMenu, ButtonText, Container,  IconContainer,  IconText,  Legend, Logo, Product, ProductScroll, TopMenu } from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {FlatList, Pressable, Text, TouchableNativeFeedback, View} from 'react-native';
import InputWithIconComponent from 'src/components/InputWithIcon';
import Dropdown from 'src/components/Dropdown';
import FormContext from 'src/contexts/Form';
import helpers from 'src/lib/helpers';

const accbLogo = "../../../assets/logos/accb.png";
const uescLogo = "../../../assets/logos/uesc.png";


const Coleta: React.FC = () => {

	const [price1, setPrice1] = useState("");
	const [price2, setPrice2] = useState("");
	const [price3, setPrice3] = useState("");
	const [price4, setPrice4] = useState("");
	const [price5, setPrice5] = useState("");
	const navigation = useNavigation();
	const route = useRoute();
	const params: any = route.params;
	const [secundaryList, setSecundaryList] = useState<any>([]);
	const [secundary, setSecundary] = useState<any>([]);
	const [secundaryInfo, setSecundaryInfo] = useState<any>();
	const [productId, setProductId] = useState(0);
	const { saveProduct, getForm, prices } = useContext(FormContext);

	useEffect(() => {
		let arr: any = [];
		let info: any = [];
		info["Padrão"] = "Não tem estabelecimento secundário";
		arr.push("Padrão");
		try {

			let list = JSON.parse(params.estabelecimento_secundario);
			list.map((item: any) => {
				let nome = item.estabelecimento_sec_nome;
				info[nome] = item;
				arr.push(nome);
			});
			setSecundaryInfo(info);
			setSecundaryList(arr);
			setSecundary(arr[0]);


		} catch (e) {
			setSecundaryList([params.estabelecimento_secundario]);
			setSecundary(params.estabelecimento_secundario);
			setSecundaryInfo(info);
		}
		// console.log(params);
		getForm(navigation, params);
		setProductId(params.prodct_id);

	}, [params]);

	useEffect(() => {
		if (productId in prices) {
			setPrice1(prices[productId][0]);
			setPrice2(prices[productId][1]);
			setPrice3(prices[productId][2]);
			setPrice4(prices[productId][3]);
			setPrice5(prices[productId][4]);
			if (String(prices[productId][5]) === "Não tem estabelecimento secundário") {
				setSecundary("Padrão");
			}
			else {
				setSecundary(prices[productId][5]);
			}
		}
	}, [productId]);

	const savePrices = () => {
		if (price1 || price2 || price3 || price4 || price5) {

			let prices = [
				helpers.formatPriceForm(price1),
				helpers.formatPriceForm(price2),
				helpers.formatPriceForm(price3),
				helpers.formatPriceForm(price4),
				helpers.formatPriceForm(price5),
				secundaryInfo[secundary]
			];
			saveProduct(productId, prices);
			navigation.navigate("Coleta", { ...params });

		} else {
			navigation.goBack();
		}
	}


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
				Você está coletando o produto <Text style={{ fontWeight: 'bold', color: colors.green }}>{params.product}</Text> no estabelecimento <Text style={{ fontWeight: 'bold', color: colors.green }}>{params.estabelecimento_nome}.</Text> Preencha os dados e pressione  <Text style={{ fontWeight: 'bold', color: colors.green }}>Salvar Preços</Text> para continuar com a coleta.
			</Legend>
			<Dropdown full={true} options={secundaryList} value={secundary} setValue={setSecundary} />

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
				<TouchableNativeFeedback onPress={savePrices} style={{ "elevation": 10 }}>
					<ButtonText>
						Salvar Preços
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
