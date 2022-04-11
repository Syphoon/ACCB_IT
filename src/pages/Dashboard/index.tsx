import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import Gradient from 'src/components/Gradient';
import Dropdown from 'src/components/Dropdown';
import colors from 'src/config/colors';
import { ColetaContainer, ColetaItem, ColetaValue, Commands, CommandsContainer, CommandsIconContainer, CommandsValue, Container, IconContainer, Legend, Logo, SelectContainer, TopMenu } from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Alert, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-elements';

// integrating
import { get_data, save_user, check_backup, get_sync_data, delete_db_info, send_prices, save_research_state, validate_date, delete_collect_info } from 'src/lib/realm';
import NetInfo from "@react-native-community/netinfo";
import AlertContext from 'src/contexts/Alert';
import notification from 'src/config/notification';
import helpers from 'src/lib/helpers';

const accbLogo = "../../assets/logos/accb.png";
const uescLogo = "../../assets/logos/uesc.png";


const Dashboard: React.FC = () => {

	const { openAlert } = useContext(AlertContext);
	const [coletas, setColetas] = useState<any>({});
	const [status, setStatus] = useState<Boolean>(false);
	const [municipio, setMunicipio] = useState<any>("");
	const [municipioList, setMunicipioList] = useState<any>([]);
	const [sendData, setSendData] = useState<any>("");
	const [estab, setEstab] = useState<any>("");
	const [estabList, setEstabList] = useState<any>(undefined);
	const [estabListDrop, setEstabListDrop] = useState<any>([]);
	const [estabAll, setEstabAll] = useState<any>({});
	const [estabBackup, setEstabBackup] = useState<any>({});
	const [hideDropdown, setHideDropdown] = useState(false);
	const navigation = useNavigation();
	const route = useRoute();
	const params = route.params;

	const send_info = async (info) => {

		let user_data = await get_data('Usuarios').then(user => {

			user = user.filtered('logado == 1');
			return user[0];

		});
		let coleta_info = await get_data("Coletas");
		let form_data: any = await get_data("Formularios");
		let coleta_data = {};
		let prices: any = [];
		let send_data = {};
		let product_id = [];
		let flag = false;
		let internet: any = null;

		// ** CHECAR ACESSO COM REDE PARA ENVIAR AS INFO
		NetInfo.fetch().then(async state => {

			internet = state.isConnected;

			if (internet == true) {

				// ** Informações da coleta salvas no banco de dados, {id,cidade, etc...}
				coleta_info = coleta_info.filtered(
					`id == "${info.coleta_id}" && pesquisa_id == "${info.pesquisa_id}" && estabelecimento_id == "${info.estabelecimento_id}"`
				);
				if (form_data[0] != undefined) {

					// ** Informações do formulário preenchido da coleta, os seja, todos os preços e seus respectivos valores
					let result = form_data.filtered(
						`coleta_id == "${info.coleta_id}" && pesquisa_id == "${info.pesquisa_id}" && estabelecimento_id == "${info.estabelecimento_id}"`,
					);
					try {
						if (result[0] != undefined) {

							let prices_array = JSON.parse(result[0].values);
							let i = 0;

							result[0].values_keys.map((key: any) => {

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
					// ** Envia pro php e faz os testes e tratamentos e insere no banco
					let result = await send_prices(send_data);
					console.log(result);
					if (result == 'Coleta Fechada.') {

						await save_research_state({ id: info.coleta_id }).then(

							openAlert("message", "Esta coleta se encontra fechada no banco de dados e será removida do aplicativo", notification.info,
								() => setTimeout(() => {
									() => navigation.replace('Dashboard')
								}, 2000)
							)
						);
						return;
					}
					// ** Dependendo da resposta , muda o estado da coleta do aplicativo
					if (result == true) {
						await save_research_state({ id: info.coleta_id }).then(
							openAlert("message", 'Coleta enviada com sucesso.', notification.success, () => setTimeout(() => {
								() => navigation.replace('Dashboard')
							}, 2000))
						);

					} else {

						if (typeof result == 'string')
							openAlert("message", result, notification.error);
						else
							openAlert("message", 'Ocorreu um erro durante a inserção, tente novamente', notification.error);
					}

				} else
					openAlert("message", 'Preencha a coleta antes de sincronizar com o servidor', notification.error);

			} else

				openAlert("message", 'É necessário internet para sincronizar com o banco ACCB', notification.error);

		});

	}

	const search_place = (value) => {
		console.log({ value });
		if (value == 'Todos') {
			setEstabList(estabBackup);
			setEstab("Todos");
		} else {
			const new_places = estabBackup.filter((place) => {
				let lower_place = place.estabelecimento_nome.toLowerCase();

				let lower_filter = value.toLowerCase();

				return lower_place.indexOf(lower_filter) > -1;
			});
			// new_places.push("Todos");
			setEstabList(new_places);
			setEstab(value);
		}

	};

	const search_city = (value) => {
		setMunicipio(value);
		let places: any = [];
		estabAll.map((val) => {
			if (val[value] != undefined) {
				places = val[value];
				return;
			}
		});

		setEstab("Todos");
		setEstabListDrop(places);
		setEstabList(places);

		// this.setState({ places: places, places_backup: places, municipio: value });
	};

	const componentDidMount = async (refresh = false) => {


		let data_cities: any = [];
		let data_estabs: any = [];
		let all_estabs: any = [];
		let estabs_to_array = [];
		let cities = [];
		let flag = true;
		let internet: any = null;
		let local_sync: any = null;
		let param: any = route.params;

		if (refresh) {

			// console.log('refresh');
			local_sync = true;

		} else {

			local_sync = await check_backup('Coletas');

		}

		if (local_sync == true) {

			NetInfo.fetch().then(async state => {

				// console.log("Tipo da conexão : ", state.type);
				// console.log("Conexão disponível : ", state.isConnected);

				internet = state.isConnected;

				if (internet == true) {

					if (refresh) {
						let validated = await validate_date();
						if (!validated) {

							openAlert("ask", 'O mês da coleta mudou, deseja excluir os dados das coletas atuais ?', notification.question, () => { delete_collect_info().then(navigation.replace('Coleta')) })

							return;

						}
						flag = await get_sync_data("collect", true);
					} else
						flag = await get_sync_data("collect");

					if (typeof flag == 'string') {

						openAlert("message", flag, notification.success)
						return;

					}

					if (flag) {
						openAlert("message", 'Sincronização realizada com sucesso !', notification.success)
						navigation.replace("Dashboard");
					}
					else
						openAlert("message", 'Não foi possível se comunicar com o Banco de Dados ACCB', notification.error)

				} else
					openAlert("message", 'É necessário internet para sincronizar com o banco ACCB', notification.error)
			});

		} else {

			// console.log("Não precisa sincronizar");
			data_cities = await get_data("Cidades");
			data_estabs = await get_data("Coletas");
			data_estabs = data_estabs.sorted(['estabelecimento_nome']);
			setStatus(true);

		}

		try {

			// console.log(data_cities[0].estabelecimento_cidade);
			let error = data_cities[0].estabelecimento_cidade;

		} catch (error) {

			flag = false;

		}

		if (flag) {

			// console.log("Param " + param);
			data_cities.map((city, idx) => {

				estabs_to_array = [];
				cities.push(city.nome);
				let filtered_estabs = data_estabs.filtered(`estabelecimento_cidade == "${city.nome}" && coleta_fechada == 0`);
				let city_name = city.nome;

				filtered_estabs.map(filtered_cities => {

					estabs_to_array.push(filtered_cities);

				});

				all_estabs.push({ [city_name]: estabs_to_array });


			});

			let bigger = 0;
			all_estabs.map((arr, key) => {

				if (arr[cities[key]].length > bigger) {
					bigger = key;
				}

			});

			// !! TENTAR CORRIGIR PRA TSX
			// try {

			// 	bigger = cities.indexOf(param.municipio || "");

			// } catch (e) { }

			setMunicipio(cities[bigger]);
			setMunicipioList(cities);
			// setEstab(all_estabs[bigger][cities[bigger]][0].estabelecimento_nome)
			setEstab("Todos")

			setEstabList(all_estabs[bigger][cities[bigger]]);
			setEstabListDrop(all_estabs[bigger][cities[bigger]]);
			setEstabAll(all_estabs);
			setEstabBackup(all_estabs[bigger][cities[bigger]]);

		}

		let validated = await validate_date();
		if (!validated)
			openAlert("ask", 'O mês da coleta mudou, deseja excluir os dados das coletas atuais ?', notification.question, () => { delete_collect_info().then(navigation.replace('Coleta')) })


	}

	const logout = async () => {

		let user_data: any = await (await get_data('Usuarios')).filtered(`logado == 1`)[0];
		save_user({ username: user_data.usuario, password: user_data.senha }, user_data.id, 0);
		navigation.replace("Login");

	}

	useEffect(() => {
		componentDidMount();
	}, []);


	const DashboardContent = (
		<>
			<TopMenu >
				<Container>
					<Logo source={require(uescLogo)} />
					<Logo source={require(accbLogo)} />
				</Container>
				<Container style={{ justifyContent: "flex-end" }}>
					<IconContainer style={{ "borderRadius": 100, "paddingHorizontal": 16, "paddingVertical": 13 }}
						onPress={() => componentDidMount(true)}
					>
						<Icon
							color={'rgba(255,255,255,1)'}
							// color={colors.secondary_lighter}
							name={'repeat'}
							size={25}
						/>
					</IconContainer>
					<IconContainer
						onPress={logout}
						style={{ "borderRadius": 100, "paddingHorizontal": 15, "paddingVertical": 13 }}>
						<Icon
							color={'rgba(255,255,255,1)'}
							// color={colors.secondary_lighter}
							name={'sign-out'}
							size={25}
						/>
					</IconContainer>
				</Container>
			</TopMenu>
			<Legend>
				Selecione <Text style={{ fontWeight: 'bold', color: colors.green }}>Iniciar Coleta</Text> para mover-se ao formulário do estabelecimento.
			</Legend>
			<SelectContainer>
				<Dropdown hide={hideDropdown} options={["Todos", ...estabListDrop]} value={estab} setValue={search_place} />
				<Dropdown hide={hideDropdown} options={municipioList} value={municipio} setValue={search_city} />
			</SelectContainer>
			<ColetaContainer>
				{
					estabList ? estabList.map((item, index) => {
						if (item.coleta_fechada == 1) {
							return
						}
						return (
							<View key={index + "col"}>
								<ColetaItem >
									<ColetaValue>
										Local :	{item.estabelecimento_nome}
									</ColetaValue>
									<ColetaValue style={{ marginTop: 5 }}>
										Bairro : {item.bairro_nome}
									</ColetaValue>
									<ColetaValue style={{ marginTop: 5 }}>
										Data : {helpers.formatDate(item.coleta_data)}
									</ColetaValue>
								</ColetaItem>
								<CommandsContainer>
									<Commands onPress={() => navigation.navigate('Coleta', {
										municipio: municipio,
										coleta_id: item.id,
										pesquisa_id: item.pesquisa_id,
										estabelecimento_id: item.estabelecimento_id,
										estabelecimento_nome: item.estabelecimento_nome,
										estabelecimento_secundario: item.estabelecimento_secundario
									})}>
										<CommandsIconContainer>
											<Icon
												color={'rgba(255,255,255,1)'}
												// color={colors.secondary_lighter}
												name={'shopping-cart'}
												size={20}
											/>
										</CommandsIconContainer>

										<CommandsValue>
											Iniciar Coleta
										</CommandsValue>

									</Commands>
									<Commands
										onPress={item.enviar ?
											() => {
												openAlert("ask", 'Realmente deseja enviar a coleta ? Todos os dados serão removidos do aplicativo após envio', notification.question, () => {
													send_info({
														coleta_id: item.id,
														pesquisa_id: item.pesquisa_id,
														estabelecimento_id: item.estabelecimento_id,
														estabelecimento_nome: item.estabelecimento_nome
													})
												})
											} :
											() => {
												openAlert("message", "Preencha a coleta antes de envia-la", notification.warning)
											}}
									>
										<CommandsIconContainer>
											<Icon
												color={'rgba(255,255,255,1)'}
												// color={colors.secondary_lighter}
												name={item.enviar ? 'send' : 'lock'}
												size={20}
											/>
										</CommandsIconContainer>
										<CommandsValue>
											{item.enviar ? "Enviar Coleta" : "Em espera"}
										</CommandsValue>
									</Commands>
								</CommandsContainer>
							</View>
						)
					}) :
						<ColetaItem >
							<Text style={{ color: colors.black, fontWeight: "bold" }} >Nenhuma coleta encontrada para este múnicipio, dirija-se até a plataforma do ACCB e cadastre
								coletas aos seus respectivos municipios.</Text>
						</ColetaItem>
				}
			</ColetaContainer>
		</>
	);

	return (

		<Gradient
			style={{ justifyContent: "flex-start", zIndex: -2 }}
			colors={[colors.primary, colors.primary, colors.secondary_lighter]}
			children={DashboardContent} />

	);
};

export default Dashboard;
