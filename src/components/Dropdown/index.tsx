import React, { useEffect, useState } from 'react';
import { Alert, Modal, TouchableNativeFeedback, View } from 'react-native';
import helpers from 'src/lib/helpers';
import { DropdownContainer, DropdownList, DropdownListValue, DropdownValue } from './styles';


interface IDropdown  {
	options: any,
	value: string,
	setValue: any,
	hide?: any,
	full?: boolean,
}

const Dropdown: React.FC<IDropdown> = ({ options, value, setValue, hide, full = false }) => {

	const [show, setShow] = useState(false);
	const [all, setAll] = useState(false);

	useEffect(() => {
		setShow(false);
	}, [hide]);

	useEffect(() => {
		options.every((item) => {
			if (typeof item == "object") {
				setAll(true);
			}
		});
	}, []);

	return (
		<TouchableNativeFeedback onPress={() => setShow(!show)}>
			<>
				<DropdownContainer style={full && { width: '82%' }} onPress={() => setShow(!show)}>
					<DropdownValue allowFontScaling={true}>
						{helpers.formatSelect(value, full)}
					</DropdownValue>
				</DropdownContainer>
				<Modal

					animationType="slide"
					transparent={true}
					visible={show}
					onRequestClose={() => {
						setShow(!show);
					}}
					>
					<TouchableNativeFeedback onPress={() => setShow(!show)}>
						<View style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,.6)" }}>
							<DropdownList>
								{
									all && (
										<TouchableNativeFeedback onPress={() => {
											setShow(false);
											setValue("All");
										}}>
											<DropdownListValue allowFontScaling={true}>
												Todos
											</DropdownListValue>
										</TouchableNativeFeedback>
									)
								}
								{
								options.map((val, index) => {
									return (
										<TouchableNativeFeedback  key={index} onPress={() => {
											setShow(false);
											setValue(typeof val == "object" ? val.estabelecimento_nome : val);
										}}>
											<DropdownListValue allowFontScaling={true}>
												{typeof val == "object" ? val.estabelecimento_nome : val}
											</DropdownListValue>
										</TouchableNativeFeedback>
									);
								})
							}

						</DropdownList>
						</View>
					</TouchableNativeFeedback>
				</Modal>
			</>
		</TouchableNativeFeedback>
	);
};

export default Dropdown;
