import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import app from '../styles';
import {heightPercentageToDP as wp} from 'react-native-responsive-screen';
import Forms from '../components/formik.js';
import Realm from '../service/realm';

export default class Form extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			secundary: undefined,
			prices: [],
			products: [],
			open: 0,
			product: undefined,
			data: undefined,
			param: this.props.route.params,
			form: undefined,
		};
	}

	product_info = (type) => {
		if (type == 1) {
			return (
				<View style={{ ...app.container_items, width: '44%' }}>
					<Text
						style={{
							...app.text,
							margin: 3,
							backgroundColor: '#fff',
							borderRadius: 5,
							color: '#000',
						}}>
						PREÇO
			</Text>
					<Text
						style={{
							...app.text,
							borderWidth: 1,
							borderColor: '#fff',
							margin: 3,
							borderRadius: 5,
						}}>
						15,30R$
			</Text>
				</View>
			);
		} else {
			return (
				<View style={{ ...app.container_items, width: '44%' }}>
					<Text
						style={{
							...app.text,
							margin: 3,
							backgroundColor: '#fff',
							borderRadius: 5,
							color: '#000',
						}}>
						PREÇO
			</Text>
					<Text
						style={{
							...app.text,
							borderWidth: 1,
							borderColor: '#fff',
							margin: 3,
							borderRadius: 5,
						}}>
						00,00 R$
			</Text>
				</View>
			);
		}
	};

	get_products = async () => {
		const realm = await Realm();
		const data = realm.objects('Produtos');
		this.setState({ products: data });
	};

	get_form_info = async () => {

		const realm = await Realm();
		const data = realm.objects('Formularios');
		const secundary = realm.objects('Coletas');
		const param = this.state.param;
		let result = null;
		let prices = [];
		let i = 0;

		// console.log(param);

		let result_secundary = secundary.filtered(
			`estabelecimento_id = "${param.estabelecimento_id}"`,
		);

		if (result_secundary[0].estabelecimento_secundario !== 'Não tem estabelecimento secundário') {

			let secundary_array = result_secundary[0].estabelecimento_secundario;
			// console.debug(result_secundary[0].estabelecimento_secundario);
			secundary_array = JSON.parse(secundary_array);
			this.setState({ secundary: secundary_array });

		}

		if (data[0] != undefined) {

			result = data.filtered(
				`coleta_id = "${param.coleta_id}" && pesquisa_id = "${param.pesquisa_id}" && estabelecimento_id = "${param.estabelecimento_id}"`,
			);

			try {
				if (result[0] != undefined) {

					let prices_array = JSON.parse(result[0].values);

					// console.log(result[0].values);
					result[0].values_keys.map((key) => {
						prices[key] = prices_array[i];
						i++;
					});

					// console.log(prices);

					// prices.map((arr, key) => {

					// 	console.log(`ARRAY [${arr}] KEY [${key}]`);

					// });

					this.setState({ prices: prices });
				}
			} catch (e) {
				console.log(e);
			}
		}
	};

	list_button = () => {
		return this.state.products.map((product) => {
			return (
				<TouchableOpacity
					key={product.id}
					onPress={() =>
						this.setState({
							modalVisible: true,
							open: product.id,
							product: product.nome,
						})
					}>
					<Text
						key={product.nome}
						style={{
							...app.button_product,
							color: 'black',
							backgroundColor: '#fff',
						}}>
						{product.nome}
					</Text>
				</TouchableOpacity>
			);
		});
	};

	componentDidMount() {
		this.get_products();
		this.get_form_info();
	}

	save_products_db = async (navigate) => {

		const realm = await Realm();
		const prices = this.state.prices;
		const param = this.state.param;
		let db_prices = [];
		let values_keys = [];

		prices.map((price, product_key) => {
			// console.log(`Product Key  [${product_key}] , Prices [${price}] `);
			values_keys.push(product_key);
		});

		db_prices = prices.filter(function (arr) {
			return arr != null;
		});

		// console.log(JSON.stringify(db_prices));

		try {
			realm.write(() => {
				realm.create(
					'Formularios',
					{
						form_id: parseInt(param.estabelecimento_id),
						values: JSON.stringify(db_prices),
						values_keys: values_keys,
						coleta_id: parseInt(param.coleta_id),
						pesquisa_id: parseInt(param.pesquisa_id),
						estabelecimento_id: parseInt(param.estabelecimento_id),
					},
					'modified',
				);
			});
		} catch (e) {
			console.log(e);
			console.log('Erro ao salvar o Formulario.');
		}

		navigate('Coleta');
	};

	save_products = (values, secundary) => {
		const data = this.state.param;
		const product_id = this.state.open;
		const prices = this.state.prices;
		let sec = this.state.secundary;

		if (secundary !== 'None' && secundary !== 'Padrão' && secundary !== undefined) {

			sec = sec.filter(val => { if (val.estabelecimento_sec_id === secundary) return val });
			values.push(sec);
			// console.log("Valores e estab secundario : " + values);

		}

		// console.log(prices);

		prices[product_id] = values;
		this.setState({ prices: prices });
	};

	render() {
		const { navigate } = this.props.navigation;
		const data = this.state.param;

		return (
			<SafeAreaView style={{ ...app.four_color, flex: 1 }}>
				<View style={{ ...app.item_side, marginLeft: '5%' }}>
					<Image style={app.logo_small} source={require('../img/logo.png')} />
					<Image style={app.logo_small} source={require('../img/logo_2.png')} />
				</View>
				<View
					style={{
						...app.container_banner,
					}}>
					<View style={app.text_wrapper}>
						<Text style={{ ...app.text_banner, ...app.one_color }}>
							Você está coletando no estabelecimento {data.estabelecimento_nome}. Selecione um produto para cadastrar seus preços.
				</Text>
					</View>
				</View>
				<View style={{ ...app.container_items, marginTop: wp('4%') }}>
					{this.list_button()}
				</View>
				<View style={{ ...app.container_items, marginTop: wp('-7%') }}>
					<TouchableOpacity
						style={app.button_menu_margin}
						onPress={() => this.save_products_db(navigate)}>
						<Text style={{ ...app.button_menu }}>Cancelar</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={app.button_menu_margin}
						onPress={() => this.save_products_db(navigate)}>
						<Text style={{ ...app.button_menu }}>Salvar</Text>
					</TouchableOpacity>
				</View>
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false });
					}}>
					<View style={app.modal_view}>
						<View style={app.modal_content}>
							<Text style={{ ...app.modal_title, ...app.one_color }}>
								PREÇOS DO PRODUTO - {this.state.product}
							</Text>
							<View
								style={{
									...app.container_items,
									marginTop: wp('0.5%'),
									...app.one_color,
									// paddingVertical: wp('3%'),
								}}>
								<Forms
									close_modal={() =>
										this.setState({
											modalVisible: !this.state.modalVisible,
										})
									}
									open={this.state.open}
									save={this.save_products}
									prices={this.state.prices}
									secundary={this.state.secundary}
								/>
							</View>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		);
	}
}
