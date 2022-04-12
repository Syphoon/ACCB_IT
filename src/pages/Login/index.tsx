import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ButtonContainer, ButtonText, Container, IconContainer, InputContainer, Logo, Subtitle, TopMenu } from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from 'src/config/colors';

const accbLogo = "../../assets/logos/accb.png";
import InputWithIconComponent from 'src/components/InputWithIcon';
import Gradient from 'src/components/Gradient';

import { useNavigation } from '@react-navigation/native';
import AlertContext from 'src/contexts/Alert';

// Integrating
import { check_backup, get_sync_data, delete_db_info, list_data, save_user, get_data } from 'src/lib/realm';
import NetInfo from "@react-native-community/netinfo";
import { ActivityIndicator, Linking, Text } from 'react-native';
import notification from 'src/config/notification';

const Home: React.FC = () => {

	const [sync, updateSync] = useState<any>(undefined);
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const navigation = useNavigation();
	// Integrating
	const { openAlert } = useContext(AlertContext);
	const url = "https://github.com/smvasconcelos";



	const handlePress = async () => {

		try {
			await Linking.openURL(url);
		} catch (e) {
			openAlert("message", "Seu dispositivo não suporta abrir links de terceiros", notification.warning);
		}

	};

	const component_built = async (refresh = false) => {

		// monica
		// 12345678

		// await delete_db_info();
		let user_data = await get_data('Usuarios');
		let result = user_data.filtered(`logado == 1`);
		let local_sync: any = "";

		try {

			if (result[0] != undefined) {

				// console.log(result[0].id);
				navigation.replace("Dashboard", {
					usuario: result[0].usuario,
					id: result[0].id,
					senha: result[0].senha,
				});
				return;

			}

		} catch (e) {
			console.log(e);
		}

		let internet: any = null;
		// await list_data('Usuarios')
		if (refresh) {
			local_sync = true;
		} else {
			local_sync = await check_backup('Usuarios');
		}

		if (sync == undefined || (refresh && local_sync)) {

			// CONEXÃO COM INTERNET E TIPO
			if (local_sync == true) {

				NetInfo.fetch().then(async state => {

					// console.log("Tipo da conexão : ", state.type);
					// console.log("Conexão disponível : ", state.isConnected);

					internet = state.isConnected;

					if (internet == true) {


						await get_sync_data("users") == true ?
							openAlert("message", 'Sincronização realizada com sucesso !', notification.success) :
							openAlert("message", 'Não foi possível se comunicar com o Banco de Dados ACCB .', notification.error)

						updateSync(false);


					} else {

						openAlert("message", 'É necessário internet para sincronizar com o banco ACCB.', notification.warning)
						updateSync(false);

					}

				});


			} else {

				// param => user_data
				updateSync(false);

			}

		}

	}

	const login = async () => {

		if (userName == "" || password == "") {
			openAlert("message", 'Preencha os dados para realizar essa função', notification.warning)
			return;
		}

		if (userName != undefined && password != undefined) {

			let user_data = await get_data('Usuarios');
			let result = user_data.filtered(`(usuario == '${userName}') && (senha == '${password}')`);

			try {

				if (result[0].usuario != undefined) {

					// ATT USER LOGGED INFO TO TRUE
					save_user({ username: result[0].usuario, password: result[0].senha }, result[0].id, 1);
					// navigation.replace("Dashboard", {
					// 	usuario: result[0].usuario,
					// 	id: result[0].id,
					// 	senha: result[0].senha,
					// });
					navigation.replace("Dashboard");

				} else {

					// Alert.alert("Usuário ou senha invalida.");
					openAlert("message", 'Usuário ou senha inválidos', notification.warning)

				}


			} catch (e) {

				// console.log(e);
				openAlert("message", 'Usuário ou senha inválidos.', notification.warning)
				return false;

			}

		}

	}

	useEffect(() => {
		component_built();
	}, []);


	const LoadingScreen = (
		<>
			<Subtitle style={{ marginBottom: 30 }} allowFontScaling={true}>Sincronizando App com o Banco de Dados ACCB</Subtitle>
			<ActivityIndicator size="large" color="#fff" />
		</>
	);



	const HomeContent = (
		<>
		<TopMenu>
				<IconContainer
					onPress={() => openAlert(
						"github",
						'Aplicativo desenvolvido por Samuel Mendonça Vasconcelos estudante de Ciência da Computação e bolsista do PIBIT/CNPq.',
						'github',
						handlePress,
					)}
					style={{ "borderRadius": 100, "paddingHorizontal": 20, "paddingVertical": 10 }}>
					<Icon
						color={'rgba(255,255,255,1)'}
						// color={colors.secondary_lighter}
						name={'info'}
						size={25}
					/>
				</IconContainer>
				<IconContainer
					onPress={() => component_built(true)}
					style={{ "borderRadius": 100, "padding": 13 }}>
					<Icon
						color={'rgba(255,255,255,1)'}
						// color={colors.secondary_lighter}
						name={'refresh'}
						size={25}
					/>
				</IconContainer>
			</TopMenu>
			<Container>
				<Logo source={require(accbLogo)} />
				<Subtitle allowFontScaling={true}>Bem Vindo ª, para continuar com o acesso preencha os dados abaixo.</Subtitle>
				<InputContainer>
					<InputWithIconComponent type='default' placeholder='Usuário' icon='user' color='#fff' value={userName} setValue={setUserName} />
					<InputWithIconComponent type='default' secure={true} placeholder='Senha' icon='lock' color='#fff' value={password} setValue={setPassword} />
				</InputContainer>
				<ButtonContainer onPress={login}>
					<ButtonText allowFontScaling={true} >Entrar</ButtonText>
				</ButtonContainer>
			</Container>
		</>
	);

	return (
		<Gradient
			colors={[colors.primary, colors.primary, colors.secondary_lighter]}
			children={sync == undefined ? LoadingScreen : HomeContent} />
	);
};

export default Home;
