import React, {useState} from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Realm from '../service/realm';
import * as axios from 'axios';


export const check_backup = async (type) => {

	const realm = await Realm();
	const data = realm.objects(type);
	try {

		if (data[0] == undefined) {

			return true;

		}

		return false;


	} catch (e) {

		return false;

	}

}

export const save_product = async (product) => {
	const realm = await Realm();
	try {

		realm.write(() => {
			realm.create(
				'Produtos',
				{ id: parseInt(product.id), nome: String(product.nome) },
				'modified'
			);
		});

	} catch (e) {

		console.log('Erro ao salvar produtos.');

	}
}

export const save_city = async (city) => {
	const realm = await Realm();
	try {

		realm.write(() => {
			realm.create(
				'Cidades',
				{ id: parseInt(city.id), nome: String(city.nome) },
				'modified'
			);
		});

	} catch (e) {

		console.log('Erro ao salvar Cidades.');

	}
}

export const save_user = async (user, id, logged = 0) => {
	const realm = await Realm();
	try {

		realm.write(() => {
			realm.create(
				'Usuarios',
				{
					id: id,
					usuario: String(user.username),
					senha: String(user.password),
					logado: logged,
				},
				'modified'
			);
		});

	} catch (e) {

		console.log('Erro ao salvar usuarios.');
		console.log(e);

	}
}

export const save_research_state = async (research) => {

	const realm = await Realm();
	try {

		realm.write(() => {
			realm.create(
				'Coletas',
				{
					id: parseInt(research.id),
					coleta_fechada: 1,
				},
				'modified'
			);
		});

	} catch (e) {

		console.log('Erro ao salvar coletas.' + e);

	}

}

export const save_research = async (research) => {

	const realm = await Realm();
	try {

		realm.write(() => {
			realm.create(
				'Coletas',
				{
					id: parseInt(research.coleta_id),
					coleta_preco_cesta: research.coleta_preco_cesta == null ? parseFloat(0) : research.coleta_preco_cesta,
					estabelecimento_cidade: research.estabelecimento_cidade,
					estabelecimento_id: parseInt(research.estabelecimento_id),
					estabelecimento_nome: research.estabelecimento_nome,
					estabelecimento_secundario: research.estabelecimento_secundario[0] != undefined ? JSON.stringify(research.estabelecimento_secundario) : "Não tem estabelecimento secundário",
					pesquisa_id: parseInt(research.pesquisa_id),
					bairro_nome: research.bairro_nome,
					coleta_data: research.coleta_data,
					coleta_fechada: research.coleta_fechada == null ? 0 : research.coleta_fechada,
				},
				'modified'
			);
		});

	} catch (e) {

		console.log('Erro ao salvar coletas.');
		console.log(e);

	}

}

export const list_data = async (data_name) => {

	const realm = await Realm();
	console.log('list_data');
	const data = realm.objects(data_name);

	data.map((value) => {

		if (data_name == 'Usuarios') {

			console.log(value.usuario);
			console.log(value.senha);

		} else if (data_name == 'Produtos' || data_name == 'Cidades') {

			console.log(value.nome);

		} else if (data_name == 'Coletas') {

			console.log(value.coleta_data);
			console.log(value.estabelecimento_nome);

		}

	});

}

export const get_data = async (data_name) => {

	const realm = await Realm();
	// console.log('get_data');
	const data = realm.objects(data_name);

	return data;

}

export const delete_db_info = async () => {

	const realm = await Realm();

	realm.write(() => {

		realm.deleteAll();

	});

}

export const get_sync_data = async (type, refresh = false) => {

	let sync = type == "users" ? "user" : "collect";
	let coletas = undefined;
	if (refresh) {
		coletas = await get_data('Coletas');
	}

	// console.log('sync');
	return axios
		.get(`https://bc3d5d336cc9.ngrok.io/request_it.php/?&accb_it_sync=${sync}`,
			{
				timeout: 1000 * 3,
				headers: {
					"Content-Type": "application/json"
				},
			}
		)
		// .get(`http://192.168.15.17:80/request_it.php/?&accb_it_sync=${sync}`)
		.then(function (response) {

			let json = response.data;
			// console.log(response.data.coletas);

			if (type == "users") {

				json.produtos.map(produto => {

					save_product(produto);

				});

				// list_data('Produtos');

				json.usuarios.map((usuario, key) => {

					save_user(usuario, key);

				});

				// list_data('Usuarios');
				return true;

			} else {

				if (refresh) {

					json.coletas.map(coleta => {
						// console.log(coleta.estabelecimento_secundario[0] != undefined ? JSON.stringify(coleta.estabelecimento_secundario) : "Não tem estabelecimento secundário");
						let check_coleta = coletas.filtered(`id = ${coleta.coleta_id} && pesquisa_id = ${coleta.pesquisa_id} && coleta_fechada = 1`);
						if (check_coleta[0] == undefined) {
							save_research(coleta);
						}

					});

				} else {

					json.coletas.map(coleta => {

						// console.log(coleta.estabelecimento_secundario[0] != undefined ? JSON.stringify(coleta.estabelecimento_secundario) : "Não tem estabelecimento secundário");
						save_research(coleta);

					});
				}
				// // list_data('Coletas');

				json.cidades.map(cidade => {

					save_city(cidade);

				});
				// list_data('Cidades');
				return true;

			}

		})
		.catch(function (error) {

			if (error.response) {

				console.log(error.response.data);

			} else {

				console.log('Não foi possível realizar a requisição.', error.message);

			}

			return false;

		});

}

export const send_prices = async (info) => {

	return axios
		.post(`https://bc3d5d336cc9.ngrok.io/request_it.php/?&accb_it_prices`,
			{
				data: info,
			},
			{
				timeout: 1000 * 2,
			}
		)
		// .get('http://192.168.15.17:80/request_it.php/?&accb_it_prices')
		.then(function (response) {

			let message = response.data == 1 ? true : false;
			console.log(message);

			return message;

		})
		.catch(function (error) {

			if (error.response) {

				console.log(error.response.data);

			} else {

				console.log('Não foi possível realizar a requisição.', error.message);

			}

			return false;

		});

}

export const loading_screen = (props) => {
	// delete_db_info();
	return (
		<View style={styles.container}>
			<Text style={styles.message}>Sincronizando App com o Banco de Dados ACCB</Text>
			<ActivityIndicator size="large" color="#fff" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		height: '100%',
		width: '100%',
		backgroundColor: "#3B9CE2",
		position: 'absolute',
	},
	message: {
		color: "#fff",
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 15
	}
});
