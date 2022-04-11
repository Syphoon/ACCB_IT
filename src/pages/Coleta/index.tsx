import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import Gradient from 'src/components/Gradient';
import colors from 'src/config/colors';
import { BottomMenu, ButtonText, Container,  Legend, Logo, Product, ProductScroll, TopMenu } from './styles';
import { Text, TouchableNativeFeedback } from 'react-native';

import { get_data } from 'src/lib/realm';
import FormContext from 'src/contexts/Form';

const accbLogo = "../../assets/logos/accb.png";
const uescLogo = "../../assets/logos/uesc.png";


const Coleta: React.FC = () => {

	const [products, setProducts] = useState<any>([]);
	const route = useRoute();
	const params: any = route.params;
	const [estab, setEstab] = useState<any>("");
	const navigation = useNavigation();
	const [savePrices, setSavePrices] = useState<any>();
	const { saveForm, clearForm, prices, getForm } = useContext(FormContext);

	useEffect(() => {
		setEstab(params.estabelecimento_nome);
	}, [params]);

	useEffect(() => {
		get_products();
		getForm(navigation, params);
	}, []);

	const get_products = async () => {
		const data = await get_data("Produtos");
		setProducts(data);
	};

	const saveColeta = async () => {
		saveForm(navigation, params);
		clearForm();
	}

	const checkProduct = (idx: number) => {
		for (var product_key in prices) {
			if (prices[product_key] != null && prices[product_key][0] != 'Não tem estabelecimento secundário.' && typeof prices[product_key][0] != "object") {
				// console.log(prices[product_key]);
				if (parseInt(product_key) == idx)
					return true;
			}
		}
		return false;
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
				Você está coletando no estabelecimento <Text style={{ color: "#8dfa5b", fontWeight: "bold" }}>{estab}.</Text>	Selecione um produto para cadastrar seus preços.
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
					products.map((item, idx) => {
						return (
							<TouchableNativeFeedback
								key={item.nome + idx}
								onPress={() => navigation.navigate("Form", {
									product: item.nome,
									product_id: item.id,
									state: params,
								})}>
								<Product style={checkProduct(item.id) && { backgroundColor: colors.primary_darker }} >
									{item.nome}
								</Product>
							</TouchableNativeFeedback>
						)
					})
				}
			</ProductScroll>
			<BottomMenu>
				<TouchableNativeFeedback style={{"elevation": 10}} onPress={() => navigation.goBack()}>
					<ButtonText>
						Cancelar
					</ButtonText>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={saveColeta} style={{ "elevation": 10 }}>
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
