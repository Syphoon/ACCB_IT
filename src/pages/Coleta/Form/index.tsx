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
import { getStoreData, setStoreData } from 'src/lib/storage';
import storage from 'src/config/storage';

const accbLogo = "../../../assets/logos/accb.png";
const uescLogo = "../../../assets/logos/uesc.png";


const Coleta: React.FC = () => {

	const [price, setPrice] = useState(["", "", "", "", ""]);
	const navigation = useNavigation();
	const route = useRoute();
	const params: any = route.params;
	const [secundaryList, setSecundaryList] = useState<any>([]);
	const [secundary, setSecundary] = useState<any>([]);
	const [secundaryInfo, setSecundaryInfo] = useState<any>();
	const { saveProduct, removeProduct, prices } = useContext(FormContext);

	useEffect(() => {
		let arr: any = [];
		let info: any = [];
		info["Padrão"] = "Não tem estabelecimento secundário.";
		arr.push("Padrão");
		try {

			let list = JSON.parse(params.state.estabelecimento_secundario);
			list.map((item: any) => {
				let nome = item.estabelecimento_sec_nome;
				info[nome] = item;
				arr.push(nome);
			});
			setSecundaryInfo(info);
			setSecundaryList(arr);
			setSecundary(arr[0]);


		} catch (e) {
			setSecundaryList([params.state.estabelecimento_secundario]);
			setSecundary(params.state.estabelecimento_secundario);
			setSecundaryInfo(info);
		}
		// console.log(params);


	}, [params]);

	useEffect(() => {
		const id = params.product_id;
		if (id in prices) {
			prices[id].map((item, idx) => {
				if (item) {
					if (item.length <= 4 && typeof item == "string")
						setPrice((prevPrice) => ({
							...prevPrice,
							[idx]: item
						}))
					else if (item[0] === "Não tem estabelecimento secundário.") {
						setSecundary("Padrão");
					} else {
						setSecundary(item.estabelecimento_sec_nome);
					}
				}
			});
		}
		const setData = async () => {
			await setStoreData("Form", storage.page);
			await setStoreData(params, storage.params);
		}
		setData();
	}, []);

	const setPriceCustom = async (idx, val) => {
		setPrice((prevPrice) => ({
			...prevPrice,
			[idx]: val
		}));
		savePrices(false);
		await setStoreData(prices, storage.price);
	};

	const savePrices = (nav = true) => {

		const id = params.product_id;
		let filtered: any = [];
		for (var key in price) {
			if (price[key])
				filtered.push(helpers.formatPriceForm(price[key]));
		}
		let local_prices = [
			...filtered,
			[secundaryInfo[secundary]]
		];
		// console.log({ local_prices });
		saveProduct(id, local_prices);
		if (nav) {
			navigation.navigate("Coleta", { ...params.state });
		}
	}

	const cancelColeta = async () => {
		const id = params.product_id;
		removeProduct(id);
		await setStoreData(prices, storage.price);
		navigation.navigate("Coleta", { ...params.state });
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
			<Legend allowFontScaling={true}>
				Você está coletando o produto <Text style={{ fontWeight: 'bold', color: colors.green }}>{params.product}</Text> no estabelecimento <Text style={{ fontWeight: 'bold', color: colors.green }}>{params.state.estabelecimento_nome}.</Text> Preencha os dados e pressione  <Text style={{ fontWeight: 'bold', color: colors.green }}>Salvar Preços</Text> para continuar com a coleta.
			</Legend>
			<Dropdown style={secundaryList.length == 1 ? { "display": "none" } : ""} full={true} options={secundaryList} value={secundary} setValue={setSecundary} />

			<ProductScroll
				contentContainerStyle={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%"
				}}>
				<InputWithIconComponent type={"numeric"} value={price[0]} setValue={async (val) => await setPriceCustom(0, val)} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price[1]} setValue={async (val) => await setPriceCustom(1, val)} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price[2]} setValue={async (val) => await setPriceCustom(2, val)} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price[3]} setValue={async (val) => await setPriceCustom(3, val)} icon={"money"} color={"#fff"} placeholder={"00,00"} />
				<InputWithIconComponent type={"numeric"} value={price[4]} setValue={async (val) => await setPriceCustom(4, val)} icon={"money"} color={"#fff"} placeholder={"00,00"} />
			</ProductScroll>
			<BottomMenu>
				<TouchableNativeFeedback style={{ "elevation": 10 }} onPress={async () => { await cancelColeta(); }}>
					<ButtonText allowFontScaling={true}>
						Cancelar
					</ButtonText>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={savePrices} style={{ "elevation": 10 }}>
					<ButtonText allowFontScaling={true}>
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
