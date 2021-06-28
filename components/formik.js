import React from 'react';
import { useState } from 'react';
import {TouchableOpacity, TextInput, View, Text} from 'react-native';
import app from '../styles';
import { Formik, Field } from 'formik';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { Picker } from '@react-native-community/picker';

const format_price = (price) => {

	price = price.replace(',', '');
	price = price.replace(' R$', '');
	let length = price.length;

	if (price != '') {
		if (length <= 3) {
			// console.log(price.replace(/^(\d{1})(\d{2}).*/,"$1,$2"));
			return price.replace(/^(\d{1})(\d{2}).*/, '$1,$2');
		} else if (length >= 4) {
			// console.log(price.replace(/^(\d{2})(\d{2}).*/,"$1,$2"));
			return price.replace(/^(\d{2})(\d{2}).*/, '$1,$2');
		}
	}

	return '';

};

const get_cursor_position = (price) => {

	price = price.replace(',', '');
	price = price.replace(' R$', '');
	console.log(price + 'cursor preço');
	selection = {
		start: 0,
		end: 0,
	};

	if (price != '') {
		selection = {
			start: price.length,
			end: price.length,
		};
	}

	return selection;

};

const set_initial_values = (prices, secundary) => {

	let initialValues = {
		value_1: '',
		value_2: '',
		value_3: '',
		value_4: '',
		value_5: '',
		secundary: secundary != undefined ? secundary : 'Não tem estabelecimento secundário.',
	};

	if (prices == undefined) {
		return initialValues;
	}

	// console.log(prices[0]);

	initialValues = {
		value_1: (prices[0] != undefined) && (!Array.isArray(prices[0]) && prices[0] !== "Não tem estabelecimento secundário.") ? prices[0] : '',
		value_2: (prices[1] != undefined) && (!Array.isArray(prices[1]) && prices[1] !== "Não tem estabelecimento secundário.") ? prices[1] : '',
		value_3: (prices[2] != undefined) && (!Array.isArray(prices[2]) && prices[2] !== "Não tem estabelecimento secundário.") ? prices[2] : '',
		value_4: (prices[3] != undefined) && (!Array.isArray(prices[3]) && prices[3] !== "Não tem estabelecimento secundário.") ? prices[3] : '',
		value_5: (prices[4] != undefined) && (!Array.isArray(prices[4]) && prices[4] !== "Não tem estabelecimento secundário.") ? prices[4] : '',
		secundary: secundary != undefined ? secundary : 'Não tem estabelecimento secundário.',
	};


	return initialValues;
};

export default function ProductForm(prop) {

	const string = 'Não tem estabelecimento secundário.';
	const get_selected_previously = (prices) => {

		if (Array.isArray(prices)) {

			let selected_secundary = prices.filter(val => { if (Array.isArray(val)) return val });
			try {

				return selected_secundary[0][0].estabelecimento_sec_id;

			} catch (error) {

				return 'Padrão';

			}

		} else {

			return 'Padrão';

		}

	}
	const [secundary, updateSecundary] = React.useState(get_selected_previously(prop.prices[prop.open]));

	return (
		<Formik
			initialValues={set_initial_values(prop.prices[prop.open], prop.secundary)}
			onSubmit={(values) => {
				const prices = [];
				let price = undefined;
				for (var key in values) {
					try {
						price = values[key];
						if (!Array.isArray(values[key])) {
							price = price.replace(',', '');
							price = price.replace(' R$', '');
							if (price != '') {
								prices.push(price);
							}
						}
					} catch (e) {
						console.log(e);
					}
				}
				prop.save(prices, secundary);
				prop.close_modal();
			}}>
			{(props) => (
				<View
					style={{
						...app.container_items,
						marginBottom: wp('3%'),
						...app.one_color,
						paddingVertical: wp('2%'),
					}}>
					<View style={{ ...app.picker_wrapper, width: '80%', marginTop: wp('3%') }}>
						{
							<Picker
								selectedValue={secundary}
								style={{ ...app.picker, width: '100%' }}
								onValueChange={(value) => updateSecundary(value)}>
								{props.values.secundary !== "Não tem estabelecimento secundário." ? <Picker.Item key={'None'} label={'Coleta Padrão ...'} value={'Padrão'} /> : null}

								{
									// console.log(props.values.secundary)
									props.values.secundary !== "Não tem estabelecimento secundário." ?
										props.values.secundary.map(val => {
											return <Picker.Item key={val.estabelecimento_sec_id} label={val.estabelecimento_sec_nome} value={val.estabelecimento_sec_id} />;
										})
										: <Picker.Item key={'None'} label={'Nenhum estabelecimento secundário ...'} value={'None'} />

								}
							</Picker>
						}
					</View>
					<TextInput
						maxLength={8}
				// selection={get_cursor_position(props.values.value_1)}
						style={app.input_modal}
						placeholder="R$ 0,00"
						onChangeText={props.handleChange('value_1')}
						value={format_price(props.values.value_1)}
						keyboardType={'numeric'}
					/>
					<TextInput
						maxLength={8}
						style={app.input_modal}
				// selection={get_cursor_position(props.values.value_2)}
						placeholder="R$ 0,00"
						onChangeText={props.handleChange('value_2')}
						value={format_price(props.values.value_2)}
						keyboardType={'numeric'}
					/>
					<TextInput
						maxLength={8}
				// selection={get_cursor_position(props.values.value_3)}
						style={app.input_modal}
						placeholder="R$ 0,00"
						onChangeText={props.handleChange('value_3')}
						value={format_price(props.values.value_3)}
						keyboardType={'numeric'}
					/>
					<TextInput
						maxLength={8}
						style={app.input_modal}
				// selection={get_cursor_position(props.values.value_4)}
						placeholder="R$ 0,00"
						onChangeText={props.handleChange('value_4')}
						value={format_price(props.values.value_4)}
						keyboardType={'numeric'}
					/>
					<TextInput
						maxLength={8}
				// selection={get_cursor_position(props.values.value_5)}
						style={app.input_modal}
						placeholder="R$ 0,00"
						onChangeText={props.handleChange('value_5')}
						value={format_price(props.values.value_5)}
						keyboardType={'numeric'}
					/>
					<View style={{ ...app.button_wrap, marginTop: wp('4%') }}>
						<TouchableOpacity
							title="Submit"
							onPress={() => prop.close_modal()}
							style={{ ...app.open_button }}>
							<Text
								style={{
									textAlign: 'center',
									// color: '#2196F3',
									fontFamily: 'times',
									fontSize: wp('4%'),
								}}>
								Cancelar
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => props.handleSubmit()}
							style={{ ...app.open_button, marginLeft: 10 }}>
							<Text
								style={{
									textAlign: 'center',
									// color: '#2196F3',
									fontFamily: 'times',
									fontSize: wp('4%'),
								}}>
								Salvar
						</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</Formik>
	);
}
