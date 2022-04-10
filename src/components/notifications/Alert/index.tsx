import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import AlertContext from "src/contexts/Alert";
import { AlertContainer, AlertOverlay, AlertText, BottomMenu, ButtonText, IconContainer } from "./styles";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from "src/config/colors";
import { Keyboard } from "react-native";


export type TypeNotification = "ask" | "message" | "github";


const AlertItem: React.FC<any> = () => {

	const { notification, closeAlert } = useContext(AlertContext);
	const [show, setShow] = useState(false);
	const [text, setText] = useState("");
	const [type, setType] = useState("");
	const [icon, setIcon] = useState("");
	const [onConfirm, setOnConfirm] = useState<any>(false);

	useEffect(() => {
		if (notification.text) {
			Keyboard.dismiss();
			setShow(true);
			setText(notification.text);
			setType(notification.type);
			setIcon(notification.icon);
			if ("onPress" in notification)
				setOnConfirm(true);
		}
	}, [notification]);


	const AlertMessage = () => (
		<AlertContainer>
			<IconContainer>
				<Icon
					color={colors.primary_darker}
					// color={colors.secondary_lighter}
					name={icon}
					size={45}
				/>
			</IconContainer>
			<AlertText>{text}</AlertText>
			<BottomMenu>
				<TouchableNativeFeedback style={{ "elevation": 10 }} onPress={() => { setShow(false); closeAlert(); }}>
					<ButtonText>
						Ok
					</ButtonText>
				</TouchableNativeFeedback>

			</BottomMenu>
		</AlertContainer>
	);
	const AlertAsk = () => (
		<AlertContainer>
			<IconContainer>
				<Icon
					color={colors.primary_darker}
					// color={colors.secondary_lighter}
					name={icon}
					size={45}
				/>
			</IconContainer>
			<AlertText>{text}</AlertText>
			<BottomMenu>
				<TouchableNativeFeedback style={{ "elevation": 10 }} onPress={() => { setShow(false); closeAlert(); }}>
					<ButtonText>
						Cancelar
					</ButtonText>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={onConfirm ? notification.onPress() : () => { setShow(false); closeAlert(); }} style={{ "elevation": 10 }}>
					<ButtonText>
						Confirmar
					</ButtonText>
				</TouchableNativeFeedback>
			</BottomMenu>
		</AlertContainer>
	);

	const AlertGithub = () => {
		return (
			<AlertContainer>
				<IconContainer>
					<Icon
						color={colors.primary_darker}
						// color={colors.secondary_lighter}
						name={icon}
						size={55}
					/>
				</IconContainer>
				<AlertText>{text}</AlertText>
				<BottomMenu>
					<TouchableNativeFeedback style={{ "elevation": 10 }} onPress={() => { setShow(false); closeAlert(); }}>
						<ButtonText>
							Fechar
						</ButtonText>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => { setShow(false); closeAlert(); }} style={{ "elevation": 10 }}>
						<ButtonText >
							Github
						</ButtonText>
					</TouchableNativeFeedback>
				</BottomMenu>
			</AlertContainer>
		);
	};


	const getAlertContent = () => {
		console.log(type);
		if (type == "github")
			return <AlertGithub />;
		if (type == "ask")
			return <AlertAsk />;
		if (type == "message")
			return <AlertMessage />;
	}

	return (
		show ? (
			<AlertOverlay>
				{getAlertContent()}
			</AlertOverlay>
		) : <></>
	);
};



const Alert: React.FC = () => {
	return (
		<AlertItem />
	);
};

export default Alert;
