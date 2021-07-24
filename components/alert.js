import React from 'react';
import { useState } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import app from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';



const custom_alert = (prop) => {

	const props = prop.props;

	const get_buttons = () => {

		if (props.type == 'message') {

			return (
				<TouchableOpacity
					onPress={() => prop.closeModal()}
					style={{ ...app.open_button }}>
					<Text
						style={{
							textAlign: 'center',
							// color: '#2196F3',
							fontFamily: 'times',
						}}>
						OK
					</Text>
				</TouchableOpacity>
			);

		} else if (props.type == 'ask') {

			return (
				<View style={{ ...app.button_wrap }}>
					<TouchableOpacity
						title="Submit"
						onPress={props.onClose != undefined ? () => { prop.closeModal(); prop.onClose(); } : () => { prop.closeModal() }}
						style={{ ...app.open_button }}>
						<Text
							style={{
								textAlign: 'center',
								// color: '#2196F3',
								fontFamily: 'times',
								// textTransform: 'uppercase',
							}}>
							Cancelar
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={prop.onConfirm != undefined ? () => { prop.closeModal(); prop.onConfirm(); } : () => { prop.closeModal() }}
						style={{ ...app.open_button, marginLeft: 10 }}>
						<Text
							style={{
								textAlign: 'center',
								// color: '#2196F3',
								fontFamily: 'times',
								// textTransform: 'uppercase',
							}}>
							Confirmar
						</Text>
					</TouchableOpacity>
				</View>
			);

		} else if (props.type == 'mobile') {

			return (
				<View style={{ ...app.button_wrap }}>
					<TouchableOpacity
						onPress={() => prop.closeModal()}
						style={{ ...app.open_button }}>
						<Text
							style={{
								textAlign: 'center',
								// color: '#2196F3',
								fontFamily: 'times',
								fontSize: wp('4%'),
							}}>
							OK
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={prop.onConfirm != undefined ? () => { prop.closeModal(); prop.onConfirm(); } : () => { prop.closeModal() }}
						style={{ ...app.open_button, marginLeft: 10, flexDirection: 'row', textAlign: 'center' }}>
						<Icon
							style={{ marginRight: '10%', textAlign: 'center' }}
							// color={'#3B9CE2'}
							color={'#000'}
							name={'github'}
							size={wp('6%')}
							underlayColor={"rgba(0,0,0,.1)"}
							backgroundColor={'rgba(255,255,255,0)'}
						/>
						<Text
							style={{
								textAlign: 'center',
								// color: '#2196F3',
								fontFamily: 'times',
								fontSize: wp('4%'),
							}}>
							Github
						</Text>
					</TouchableOpacity>
				</View>
			);

		}

	}



	const mobile = (
		<View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={props.modalVisible}
				onRequestClose={() => {
					openModal(false);
				}}>
				<TouchableWithoutFeedback onPress={() => prop.closeModal()}>
					<View style={app.alert_view} />
				</TouchableWithoutFeedback >
				<View style={app.alert_content}>
					<Text style={app.alert_title}>ACCB Coleta</Text>
					{/* <Icon.Button
						style={{ marginLeft: 15 }}
						color={'#3B9CE2'}
						name={props.icon != undefined ? props.icon : 'info-circle'}
						size={wp('15%')}
						underlayColor={"rgba(0,0,0,.1)"}
						backgroundColor={'rgba(255,255,255,0)'}
					/> */}
					<Text style={{ ...app.alert_message, textAlign: 'justify', fontSize: wp('3.5%'), marginBottom: 15 }}>{props.message} O aplicativo foi desenvolvido para auxiliar o processo de coleta do projeto de extensão Acompanhamento do Custo da Cesta Básica (ACCB). </Text>
					{get_buttons()}
				</View>
			</Modal>
		</View>
	);

	const notmobile = (
		<View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={props.modalVisible}
				onRequestClose={() => {
					openModal(false);
				}}>
				<TouchableWithoutFeedback onPress={() => prop.closeModal()}>
					<View style={app.alert_view} />
				</TouchableWithoutFeedback >
				<View style={app.alert_content}>
					<Icon.Button
						style={{ marginLeft: 15 }}
						color={'#3B9CE2'}
						name={props.icon != undefined ? props.icon : 'info-circle'}
						size={wp('12%')}
						underlayColor={"rgba(0,0,0,.1)"}
						backgroundColor={'rgba(255,255,255,0)'}
					/>
					<Text style={app.alert_message}>{props.message}</Text>
					{get_buttons()}
				</View>
			</Modal>
		</View>
	);


	return props.type == 'mobile' ? mobile : notmobile;

}


export default custom_alert;
