import React, {Component} from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Alert, TextInput } from 'react-native';

import NetInfo from "@react-native-community/netinfo";

import app from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Inputs from '../components/text_input';
import PopUp from '../components/alert';
import { check_backup, loading_screen, get_sync_data, delete_db_info, list_data, save_user, get_data } from './realm'

export default Login = (props) => {

	const [sync, updateSync] = React.useState(sync);
	const [modalVisible, updateModal] = React.useState(modalVisible);
	const [username, onChangeTextUser] = React.useState(username);
	const [password, onChangeTextSenha] = React.useState(password);
	const [prop, updateProps] = React.useState({
		props: {
			type: undefined,
			message: undefined,
			icon: undefined,
			confirm: undefined,
			modalVisible: false,
		}
	})
	const { replace } = props.navigation;
	const { navigate } = props.navigation;

	show_alert = (info) => {

		const message = info.message;
		const icon = info.icon != undefined ? info.icon : undefined;
		const type = info.type;

		updateProps({ props: { message: message, icon: icon, type: type, modalVisible: true } });

	}

	reset_alert = () => {

		updateProps({ props: { message: undefined, icon: undefined, type: undefined, modalVisible: false } });

	}

	const component_built = async (refresh = false) => {

		// monica
		// 12345678


		await delete_db_info();
		let user_data = await get_data('Usuarios');
		let result = user_data.filtered(`logado == 1`);
		let local_sync = null;

		if (result[0] != undefined) {

			// console.log(result[0].id);
			replace("Coleta", {
				usuario: result[0].usuario,
				id: result[0].id,
				senha: result[0].senha,
			});
			return;

		}

		let internet = null;
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

						// await get_sync_data("users") == true ? Alert.alert("Sincronização realizada com sucesso !") : Alert.alert("Não foi possível se comunicar com o Banco de Dados ACCB .");
						await get_sync_data("users") == true ? show_alert({ message: 'Sincronização realizada com sucesso !', icon: 'check-square', type: 'message' }) : show_alert({ message: 'Não foi possível se comunicar com o Banco de Dados ACCB .', icon: 'times', type: 'message' });
						// console.log("Refresh " + refresh);

						updateSync(false);


					} else {

						// Alert.alert("É necessário internet para sincronizar com o banco ACCB.");
						show_alert({ message: 'É necessário internet para sincronizar com o banco ACCB.', icon: 'times', type: 'message' })
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

		if (username != undefined && password != undefined) {

			let user_data = await get_data('Usuarios');
			let result = user_data.filtered(`(usuario == "${username}") && (senha == "${password}")`);
			try {

				if (result[0].usuario != undefined) {

					// ATT USER LOGGED INFO TO TRUE
					save_user({ username: result[0].usuario, password: result[0].senha }, result[0].id, 1);
					replace("Coleta", {
						usuario: result[0].usuario,
						id: result[0].id,
						senha: result[0].senha,
					});

				} else {

					// Alert.alert("Usuário ou senha invalida.");
					show_alert({ message: 'Usuário ou senha inválidos.', icon: 'times', type: 'message' })

				}


			} catch (e) {

				console.log(e);
				// Alert.alert("Usuário ou senha invalida.");
				show_alert({ message: 'Usuário ou senha inválidos.', icon: 'times', type: 'message' })
				return false;

			}

		}

	}

	const login_screen = () => {

		return (
			<SafeAreaView style={{ ...app.one_color, flex: 1 }}>
				<PopUp
					props={prop.props}
					closeModal={() => reset_alert()} />
				<View style={{ ...app.item_side, marginLeft: '5%' }}></View>
				<View>
					<TouchableOpacity
						style={app.refresh_button_login}
						onPress={() => component_built(true)} >
						<Icon
							// color={'rgba(255,255,255,0.8)'}
							color={'#2196F3'}
							name={'refresh'}
							size={hp('4%')}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={app.info_button_login}
						onPress={() => show_alert({ message: 'Aplicativo desenvolvido por Samuel Mendonça Vasconcelos estudante de Ciência da computação, em fase de aprendizado.', icon: 'mobile', type: 'mobile' })} >
						<Icon
							// color={'rgba(255,255,255,0.8)'}
							color={'#2196F3'}
							name={'info'}
							size={hp('4%')}
						/>
					</TouchableOpacity>
				</View>
				<View
					style={{ ...app.container, marginTop: hp('15%') }}>
					<Image styles={app.logo} source={require('../img/logo_2.png')} />
					<View style={app.text_wrapper}>
						<Text style={{ ...app.text }}>
							Bem Vindo ª, para continuar com o acesso preencha os dados abaixo.
				</Text>
						<TextInput
							secureTextEntry={false}
							style={app.text_input}
							placeholderTextColor={'#000'}
							onChangeText={(username) => onChangeTextUser(username)}
							value={username}
							placeholder={'Usuário'}
						/>
						<TextInput
							secureTextEntry={true}
							style={app.text_input}
							placeholderTextColor={'#000'}
							onChangeText={(password) => onChangeTextSenha(password)}
							value={password}
							placeholder={'Senha'}
						/>
						<TouchableOpacity
							// style={{...app.button, ...app.white_color}}
							onPress={() => login()}>
							{/* onPress={() => replace('Coleta')}> */}
							<Text style={app.button_menu}>Entrar</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		);

	}

	component_built();

	return sync == undefined ? loading_screen() : login_screen();

}
