import React, {Component, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Modal,
	TouchableOpacity,
	FlatList,
	Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import {Picker} from '@react-native-community/picker';
import NetInfo from "@react-native-community/netinfo";

import app from '../styles';
import {heightPercentageToDP as wp} from 'react-native-responsive-screen';

import PopUp from '../components/alert';

import { get_data, save_user, check_backup, get_sync_data, delete_db_info, send_prices, save_research_state } from './realm'
// import {check_backup, loading_screen, get_sync_data, delete_db_info, list_data, save_user, get_data} from './realm'


export default class Form extends Component {

	constructor(props) {
		super(props);
		this.state = {
			municipio: 'itabuna',
			estabelecimento: 'mercado',
			coletas_status: false,
			cities: [],
			places: [],
			places_all: [],
			places_backup: [],
			placeholder: [],
			send_data: undefined,
			props: {
				type: undefined,
				message: undefined,
				icon: undefined,
				confirm: undefined,
				modalVisible: false,
			}
		};
	}

	send_info = async (info) => {

		// await delete_db_info();
		const { replace } = this.props.navigation;
		let user_data = await get_data('Usuarios').then(user => {

			user = user.filtered('logado == 1');
			return user[0];

		});
		let coleta_info = await get_data("Coletas");
		let form_data = await get_data("Formularios");
		let coleta_data = {};
		let prices = [];
		let send_data = {};
		let product_id = [];
		let flag = false;
		let internet = null;

		// CHECAR ACESSO COM REDE PARA ENVIAR AS INFO
		NetInfo.fetch().then(async state => {

			internet = state.isConnected;

			if (internet == true) {

				// Informações da coleta salvas no banco de dados, {id,cidade, etc...}
				coleta_info = coleta_info.filtered(
					`id == "${info.coleta_id}" && pesquisa_id == "${info.pesquisa_id}" && estabelecimento_id == "${info.estabelecimento_id}"`
				);
				if (form_data[0] != undefined) {

					// Informações do formulário preenchido da coleta, os seja, todos os preços e seus respectivos valores
					let result = form_data.filtered(
						`coleta_id == "${info.coleta_id}" && pesquisa_id == "${info.pesquisa_id}" && estabelecimento_id == "${info.estabelecimento_id}"`,
					);
					try {
						if (result[0] != undefined) {

							let prices_array = JSON.parse(result[0].values);
							let i = 0;

							result[0].values_keys.map((key) => {

								if ((prices_array[i][0] !== false) && prices_array[i].length != 0) {
									prices[key] = prices_array[i];
									product_id.push(key);
								}
								i++;

							});

							form_data = prices.filter(price => { if (price != null) return price });
							if (form_data.length != 0) {
								flag = true;
							}
						}
					} catch (e) {
						console.log("Error filtrando os dados de formulário : " + e);
					}

				}

				if (flag) {

					for (var key in coleta_info[0]) {
						const info = coleta_info[0];
						coleta_data[key] = info[key];
						// console.log(`key = ${key} | array ${info[key]}`);
					}

					send_data['info'] = coleta_data;
					send_data['prices'] = JSON.stringify(form_data);
					send_data['products_id'] = product_id;
					// console.log(`array ${JSON.stringify(form_data)}`);
					// Envia pro php e faz os testes e tratamentos e insere no banco
					let result = await send_prices(send_data);
					// Dependendo da resposta , muda o estado da coleta do aplicativo
					if (result == true) {
						await save_research_state({ id: info.coleta_id });
						// Alert.alert(`Coleta enviada com sucesso.`);
						replace('Coleta', {
							usuario: user_data.usuario,
							id: user_data.id,
							senha: user_data.senha,
						}
						);
						this.show_alert({ message: 'Coleta enviada com sucesso.', icon: 'check-square', type: 'message' })

					} else {
						// Alert.alert('Ocorreu um erro durante a inserção, tente novamente.');
						if (typeof result == 'string') {

							this.show_alert({ message: result, icon: 'times', type: 'message' })

						} else {

							this.show_alert({ message: 'Ocorreu um erro durante a inserção, tente novamente.', icon: 'times', type: 'message' })

						}
					}

				} else {

					// Alert.alert('Preencha a coleta antes de sincronizar com o servidor.');
					this.show_alert({ message: 'Preencha a coleta antes de sincronizar com o servidor.', icon: 'times', type: 'message' })

				}

			} else {

				this.show_alert({ message: 'É necessário internet para sincronizar com o banco ACCB.', icon: 'times', type: 'message' })
				// Alert.alert("É necessário internet para sincronizar com o banco ACCB.");

			}

		});

	}

	// render_places = ({ item }) => (

	// 	<View key={item.id}>

	// 		<View style={{ ...app.container_list }}>
	// 			<View style={app.text_list_container}>
	// 				<Text style={{ ...app.text_list_first }}>Estabelecimento  - </Text>
	// 				<Text style={{ ...app.text_list }}>{item.estabelecimento_nome}</Text>
	// 			</View>
	// 			{/* <View style={app.text_list_divider} /> */}
	// 			<View style={app.text_list_container}>
	// 				<Text style={{ ...app.text_list_first }}>Cidade  - </Text>
	// 				<Text style={{ ...app.text_list }}>{item.estabelecimento_cidade}</Text>
	// 			</View>
	// 			{/* <View style={app.text_list_divider} /> */}
	// 			<View style={app.text_list_container}>
	// 				<Text style={{ ...app.text_list_first }}>Bairro  - </Text>
	// 				<Text style={{ ...app.text_list }}>{item.bairro_nome}</Text>
	// 			</View>
	// 			{/* <View style={app.text_list_divider} /> */}
	// 			<View style={app.text_list_container}>
	// 				<Text style={{ ...app.text_list_first }}>Data  - </Text>
	// 				<Text style={{ ...app.text_list }}>{item.coleta_data}</Text>
	// 			</View>
	// 			{/* <View style={app.text_list_divider} /> */}
	// 			<View style={app.text_list_container}>
	// 				<Text style={{ ...app.text_list_first }}>Preço Médio  - </Text>
	// 				<Text style={{ ...app.text_list }}>{item.coleta_preco_cesta == 0 ? "N/A" : item.coleta_preco_cesta}</Text>
	// 			</View>
	// 		</View>

	// 		<View key={item.id}>
	// 			{this.icon_list(
	// 				{ coleta_id: item.id, pesquisa_id: item.pesquisa_id, estabelecimento_id: item.estabelecimento_id },
	// 				{ name_1: item.coleta_fechada == 0 ? 'unlock' : 'lock', name_2: 'shopping-cart' },
	// 				' ',
	// 			)}
	// 		</View>
	// 	</View>

	// );
	show_alert = (info) => {

		const message = info.message;
		const icon = info.icon != undefined ? info.icon : undefined;
		const type = info.type;
		const send_data = info.send_data;

		this.setState({ props: { message: message, icon: icon, type: type, modalVisible: true }, send_data: send_data });

	}

	reset_alert = () => {

		this.setState({ props: { message: undefined, icon: undefined, type: undefined, modalVisible: false }, send_data: undefined });
		console.log(this.state.props);
	}

	render_places = ({ item }) => {

		if (item.coleta_fechada == 0) {
			return (
				<View key={item.id}>
					<View style={{ ...app.container_list }}>
						<View style={app.text_list_container}>
							<Text style={{ ...app.text_list_first }}>Local  - </Text>
							<Text style={{ ...app.text_list }}>{item.estabelecimento_nome}</Text>
						</View>
						{/* <View style={app.text_list_divider} /> */}
						{/* <View style={app.text_list_container}>
							<Text style={{ ...app.text_list_first }}>Cidade  - </Text>
							<Text style={{ ...app.text_list }}>{item.estabelecimento_cidade}</Text>
						</View> */}
						{/* <View style={app.text_list_divider} /> */}
						<View style={app.text_list_container}>
							<Text style={{ ...app.text_list_first }}>Bairro  - </Text>
							<Text style={{ ...app.text_list }}>{item.bairro_nome}</Text>
						</View>
						{/* <View style={app.text_list_divider} /> */}
						<View style={app.text_list_container}>
							<Text style={{ ...app.text_list_first }}>Data  - </Text>
							<Text style={{ ...app.text_list }}>{item.coleta_data.split('-').reverse().join('-').replace(/-/g, '/')}</Text>
						</View>
						{/* <View style={app.text_list_divider} /> */}
						{/* <View style={app.text_list_container}>
							<Text style={{ ...app.text_list_first }}>Preço Médio  - </Text>
							<Text style={{ ...app.text_list }}>{item.coleta_preco_cesta == 0 ? "N/A" : item.coleta_preco_cesta}</Text>
						</View> */}
					</View>

					<View key={item.id} style={{ alignItems: 'center', marginBottom: 10, }}>
						{this.icon_list(
							{ coleta_id: item.id, pesquisa_id: item.pesquisa_id, estabelecimento_id: item.estabelecimento_id, estabelecimento_nome: item.estabelecimento_nome },
							{ name_1: 'shopping-cart', send: item.enviar },
							' ',
						)}
					</View>
				</View>
			);
		}

	}

	search_place = (value) => {

		if (value == 'ALL') {
			this.setState({ places: this.state.places_backup, estabelecimento: value });
		} else {
			const new_places = this.state.places_backup.filter((place) => {
				let lower_place = place.estabelecimento_nome.toLowerCase();

				let lower_filter = value.toLowerCase();

				return lower_place.indexOf(lower_filter) > -1;
			});
			this.setState({ places: new_places, estabelecimento: value });
		}

	};

	set_place_holder = (item) => {
		let placeholder = item.map((value) => {
			return value.estabelecimento_nome;
		});

		this.setState({ placeholder: placeholder });
	};

	search_city = (value) => {
		this.setState({ municipio: value });
		let places;

		this.state.places_all.map((val) => {
			if (val[value] != undefined) {
				places = val[value];
				return;
			}
		});

		// console.log("Places" + places);

		this.set_place_holder(places);
		this.setState({ places: places, places_backup: places, municipio: value });
	};

	picker_list = (place_holders, type) => {

		if (type == 2) {
			return (
				<View key={'Estabelecimento'} style={app.picker_wrapper}>
					<Picker
						selectedValue={this.state.estabelecimento}
						style={app.picker}
						itemStyle={{ backgroundColor: "white", color: "black", fontFamily: "Ebrima" }}
						onValueChange={(value) => this.search_place(value)}>
						<Picker.Item key={'ALL'} label={'Todos'} value={'ALL'} />
						{place_holders.map((val) => {
							return <Picker.Item key={val} label={val} value={val} />;
						})}
					</Picker>
				</View>
			);
		} else {
			return (
				<View key={'Cidade'} style={app.picker_wrapper}>
					<Picker
						selectedValue={this.state.municipio}
						style={app.picker}
						itemStyle={{ backgroundColor: "white", color: "black", fontFamily: "Ebrima" }}
						onValueChange={(value) => this.search_city(value)}>
						{this.state.coletas_status == false ? <Picker.Item key={'ALL'} label={'Todos'} value={'ALL'} /> :

							place_holders.map(val => {
								return <Picker.Item key={val} label={val} value={val} />;
							})

						}

					</Picker>
				</View>
			);
		}
	};

	icon_list = (text, icon, type) => {
		const { navigate } = this.props.navigation;
		const send_data = {
			coleta_id: text.coleta_id,
			pesquisa_id: text.pesquisa_id,
			estabelecimento_id: text.estabelecimento_id,
			estabelecimento_nome: text.estabelecimento_nome
		}

		// MODAL
		if (type == 'text') {
			return (
				<View
					style={{
						width: wp('22%'),
						alignContent: 'center',
						justifyContent: 'center',
					}}>
					<Icon
						//   3B9CE2
						color={'#fff'}
						style={{ textAlign: 'center' }}
						name={icon}
						size={wp('4%')}
					/>
					<Text style={{ ...app.text_icon, marginBottom: 10 }}>{text}</Text>
				</View>
			);
		} else {
			return (
				<View
					style={{
						...app.container_icon_button,
					}}>
					{/* <View>
						<Icon.Button
							style={{ marginLeft: 20 }}
							color={'#423b3b'}
							name={icon.name_1}
							size={wp('5%')}
							backgroundColor={'rgba(255,255,255,0)'}
						/>
						<Text style={app.container_icon_text}>{icon.name_1 == "unlock" ? "Aberta" : "Fechada"}</Text>
					</View> */}
					<View>
						<Icon.Button
							style={{ marginLeft: 15 }}
							color={'#3B9CE2'}
							name={icon.name_1}
							size={wp('5%')}
							underlayColor={"rgba(0,0,0,.1)"}
							backgroundColor={'rgba(255,255,255,0)'}
							onPress={() => navigate('Form', {
								coleta_id: text.coleta_id,
								pesquisa_id: text.pesquisa_id,
								estabelecimento_id: text.estabelecimento_id,
								estabelecimento_nome: text.estabelecimento_nome
							})}
						/>
						<Text style={app.container_icon_text}>Iniciar Coleta</Text>
					</View>
					<View>
						<Icon.Button
							style={{ marginLeft: 15 }}
							color={icon.send === true ? '#3B9CE2' : '#423b3b'}
							name={"send"}
							size={wp('5%')}
							underlayColor={"rgba(0,0,0,.1)"}
							backgroundColor={'rgba(255,255,255,0)'}
							onPress={icon.send ? () => this.show_alert({ message: 'Realmente deseja enviar a coleta ? Todos os dados serão removidos do aplicativo após envio.', icon: 'question-circle', type: 'ask', send_data: send_data }) : () => this.show_alert({ message: 'Preencha a coleta antes de envia-la.', icon: 'times', type: 'message' })}
						/>
						<Text style={{ ...app.container_icon_text, textAlign: 'center' }}>Enviar</Text>
					</View>
				</View>
			);
		}
	};

	async componentDidMount(refresh = false) {

		// Cidades
		const { replace } = this.props.navigation;
		let user_data = await get_data('Usuarios').then(user => {

			user = user.filtered('logado == 1');
			return user[0];

		});
		let data_cities = undefined;
		let data_estabs = undefined;
		let all_estabs = [];
		let estabs_to_array = [];
		let cities = [];
		let flag = true;
		let internet = null;
		let local_sync = null;

		if (refresh) {

			// console.log('refresh');
			local_sync = true;

		} else {

			local_sync = await check_backup('Coletas');

		}

		// await delete_db_info();

		if (local_sync == true) {

			NetInfo.fetch().then(async state => {

				// console.log("Tipo da conexão : ", state.type);
				// console.log("Conexão disponível : ", state.isConnected);

				internet = state.isConnected;

				if (internet == true) {

					if (refresh) {
						flag = await get_sync_data("collect", true);
					} else {
						flag = await get_sync_data("collect");
					}

					if (flag) {

						// Alert.alert("Sincronização realizada com sucesso !");
						this.show_alert({ message: 'Sincronização realizada com sucesso !', icon: 'check-square', type: 'message' })
						replace("Coleta", {
							usuario: user_data.usuario,
							id: user_data.id,
							senha: user_data.senha,
						});
						// data_cities = await get_data("Cidades");
						// data_estabs = await get_data("Coletas");

					} else {

						// Alert.alert("Não foi possível se comunicar com o Banco de Dados ACCB .")
						this.show_alert({ message: 'Não foi possível se comunicar com o Banco de Dados ACCB .', icon: 'times', type: 'message' })

					}

				} else {

					// Alert.alert("É necessário internet para sincronizar com o banco ACCB.");
					this.show_alert({ message: 'É necessário internet para sincronizar com o banco ACCB.', icon: 'times', type: 'message' })

				}

			});

		} else {

			// console.log("Não precisa sincronizar");
			data_cities = await get_data("Cidades");
			data_estabs = await get_data("Coletas");
			this.setState({ coletas_status: true });

		}

		try {

			// console.log(data_cities[0].estabelecimento_cidade);
			let error = data_cities[0].estabelecimento_cidade;

		} catch (error) {

			flag = false;
			return;

		}
		if (flag) {

			data_cities.map(city => {

				estabs_to_array = [];
				cities.push(city.nome);
				let filtered_estabs = data_estabs.filtered(`estabelecimento_cidade == "${city.nome}" && coleta_fechada == 0`);
				let city_name = city.nome;

				filtered_estabs.map(filtered_cities => {

					estabs_to_array.push(filtered_cities);

				});

				all_estabs.push({ [city_name]: estabs_to_array });


			});

			this.setState({ cities: cities });

			// Coletas e ou estabs

			// Primeiro place holder para cidade de itabuna
			this.set_place_holder(all_estabs[0][cities[0]]);

			this.setState({
				places: all_estabs[0][cities[0]],
				places_backup: all_estabs[0][cities[0]],
				places_all: all_estabs,
			});

		}


	}

	logout = async () => {

		const { replace } = this.props.navigation;
		let user_data = await get_data('Usuarios').then(user => {

			user = user.filtered('logado == 1');
			return user[0];

		});

		console.log(user_data);
		save_user({ username: user_data.usuario, password: user_data.senha }, user_data.id, 0);

		replace("Login");

	}

	render() {
		return (
			<SafeAreaView style={{ ...app.four_color, flex: 1 }}>
				<PopUp
					props={this.state.props}
					closeModal={() => this.reset_alert()}
					onConfirm={this.state.send_data == undefined ? undefined : () => this.send_info(this.state.send_data)} />
				<View style={{ ...app.item_side, marginLeft: '5%' }}>
					<Image style={app.logo_small} source={require('../img/logo.png')} />
					<Image style={app.logo_small} source={require('../img/logo_2.png')} />
					<TouchableOpacity
						style={app.logout_button}
						onPress={() => this.logout()} >
						<Icon
							color={'rgba(255,255,255,0.8)'}
							name={'sign-out'}
							size={wp('4%')}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={app.refresh_button}
						onPress={() => this.componentDidMount(true)} >
						<Icon
							color={'rgba(255,255,255,0.8)'}
							name={'refresh'}
							size={wp('4%')}
						/>
					</TouchableOpacity>
				</View>
				<View
					style={{
						...app.container_banner,
						marginTop: wp('2%'),
					}}>
					<View style={app.text_wrapper}>
						<Text style={{ ...app.text_banner, ...app.one_color }}>
							Selecione iniciar coleta para mover-se ao formulário do estabelecimento.
						</Text>
					</View>
				</View>
				<View style={{ ...app.container_items }}>
					{this.picker_list(this.state.cities, 1)}
					{this.picker_list(this.state.placeholder, 2)}
				</View>
				<View style={{ ...app.container_scroll, flex: 1 }}>
					<FlatList
						data={this.state.places}
						renderItem={this.render_places}
						keyExtractor={(item, index) =>
							item.estab + (index * 100).toString()
						}
						ListEmptyComponent={() => (
							<View
								style={{
									flex: 1,
									alignItems: 'center',
									justifyContent: 'center',
									marginTop: 50,
								}}>
								<Text style={{ color: '#fff', fontSize: 15, textAlign: 'center', padding: 15, ...app.one_color }}>
									Nenhuma coleta encontrada, vá até o site do projeto ACCB e insira as coletas que deseja acessar pelo aplicativo para que seja possível sincroniza-las.
								</Text>
							</View>
						)}
					/>
				</View>
			</SafeAreaView>
		);
	}
}
