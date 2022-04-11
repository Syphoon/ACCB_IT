import React, { createContext, useContext, useEffect, useState } from "react";
import notification from "src/config/notification";
import { save_research_state } from "src/lib/realm";
import Realm from "src/services/realm";
import AlertContext from "../Alert";

interface IForm {
	saveForm?: any,
	clearForm?: any,
	saveProduct?: any,
	getForm?: any,
	prices?: any,
}
const FormContext = createContext<IForm>({
	saveProduct: "",
	getForm: "",
	saveForm: "",
	clearForm: "",
	prices: "",
});


export const FormProvider: React.FC<IForm> = ({ children }) => {

	const [prices, setPrices] = useState<any>([]);
	const { openAlert } = useContext(AlertContext);

	const saveProduct = (id: number, data: any) => {
		setPrices((prevState) => ({
			...prevState,
			[id]: data,
		}));
	}

	const saveForm = async (navigation: any, param: any) => {

		const realm = await Realm();
		let db_prices: any = [];
		let values_keys: any = [];
		let true_length = 0;
		let send = false;

		for (var product_key in prices) {

			console.log(prices[product_key]);

			if (prices[product_key].length >= 2) {
				true_length++;
			} else if ((prices[product_key].length == 1) && prices[product_key][0] != 'Não tem estabelecimento secundário.') {
				true_length++;
			} else if (prices[product_key].length == 1 && typeof prices[product_key][0] != "object") {
				true_length++;
			}

			if (prices[product_key] != null && prices[product_key][0] != 'Não tem estabelecimento secundário.' && typeof prices[product_key][0] != "object") {
				values_keys.push(parseInt(product_key));
				db_prices.push(prices[product_key]);
			}
		}

		send = (true_length > 0) && (db_prices.length > 0) && (values_keys.length > 0) ? true : false;

		if (true_length == 0) {
			openAlert("message", "Preencha a coleta antes de salva-la.", "warning");
			return;
		}

		// console.log({ values_keys });
		// console.log({ send });
		// console.log({ values_keys });
		// console.log({ db_prices });
		// console.debug("true_length = " + true_length);
		// console.debug(JSON.stringify(db_prices));

		try {
			realm.write(() => {
				realm.create(
					"Formularios",
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
			openAlert("message", 'Erro ao salvar o Formulario', notification.error);
		}

		await save_research_state({ id: parseInt(param.coleta_id) }, true, send).then(
			val => {

				if (val)
					// console.log("Voltando para coleta " + this.state.municipio + this.state.estabelecimento_id);
					navigation.replace('Dashboard', {
						municipio: param.estabelecimento_nome,
						estabelecimento_id: param.estabelecimento_id
					});
				// console.log('salvou');
				else
					openAlert("message", 'Erro ao salvar o Formulario', notification.error);

			}
		);

	}


	const getForm = async (navigation: any, param: any) => {

		const realm = await Realm();
		const data = realm.objects('Formularios');
		const secundary = realm.objects('Coletas');
		let result: any = null;
		let prices: any = [];
		let secundary_value = "";
		let i = 0;

		let result_secundary = secundary.filtered(
			`estabelecimento_id = "${param.estabelecimento_id}"`,
		);

		// !! estab secundario
		if (result_secundary[0].estabelecimento_secundario !== 'Não tem estabelecimento secundário') {

			let secundary_array = result_secundary[0].estabelecimento_secundario;
			// console.debug(result_secundary[0].estabelecimento_secundario);
			secundary_array = JSON.parse(secundary_array);
			secundary_value = secundary_array;

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

					setPrices(prices);
				}
			} catch (e) {
				console.log(e);
			}
		}
	}

	const clearForm = () => {
		setPrices([]);
	}

	return (
		<FormContext.Provider
			value={{
				saveProduct,
				saveForm,
				getForm,
				clearForm,
				prices,
			}}>
			{children}
		</FormContext.Provider>
	);
};

export default FormContext;
