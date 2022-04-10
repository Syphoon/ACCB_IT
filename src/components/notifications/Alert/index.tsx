import React, { useContext, useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import AlertContext from "src/contexts/Alert";
import { AlertContainer, AlertOverlay, AlertText, BottomMenu, ButtonText, IconContainer } from "./styles";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from "src/config/colors";


export type TypeNotification = "ask" | "message" | "github";


const AlertItem: React.FC<any> = ({
	onConfirm,
}) => {

	const { notification } = useContext(AlertContext);
	const [show, setShow] = useState(false);
	const [text, setText] = useState("");
	const [type, setType] = useState("");
	const [icon, setIcon] = useState("");

	useEffect(() => {
		setShow(true);
		setText(notification.text);
		setType(notification.type);
		setIcon(notification.icon);
	}, [notification]);


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
				<TouchableNativeFeedback style={{ "elevation": 10 }} onPress={() => setShow(false)}>
					<ButtonText>
						Cancelar
					</ButtonText>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={() => { setShow(false); onConfirm() }} style={{ "elevation": 10 }}>
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
					<TouchableNativeFeedback style={{ "elevation": 10 }} onPress={() => setShow(false)}>
						<ButtonText>
							Fechar
						</ButtonText>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => setShow(false)} style={{ "elevation": 10 }}>
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
