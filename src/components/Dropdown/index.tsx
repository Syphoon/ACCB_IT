import React, { useEffect, useState } from 'react';
import { Alert, Modal, TouchableNativeFeedback, View } from 'react-native';
import helpers from 'src/lib/helpers';
import { DropdownContainer, DropdownList, DropdownListValue, DropdownValue } from './styles';


interface IDropdown  {
	options: [any],
	value: string,
	setValue: any,
	hide?: any,
}

const Dropdown: React.FC<IDropdown> = ({options, value, setValue, hide}) => {

	const [show, setShow] = useState(false);

	useEffect(() => {
		setShow(false);
	}, [hide]);

	return (
		<TouchableNativeFeedback onPress={() => setShow(!show)}>
			<>
				<DropdownContainer  onPress={() => setShow(!show)}>
					<DropdownValue>
						{helpers.formatSelect(value)}
					</DropdownValue>
				</DropdownContainer>
				<Modal

					animationType="fade"
					transparent={true}
					visible={show}
					onRequestClose={() => {
						setShow(!show);
					}}
					>
					<TouchableNativeFeedback onPress={() => setShow(!show)}>
						<View style={{flex: 1, backgroundColor: "rgba(0,0,0,.6)"}}>
							<DropdownList>
							{
								options.map((val, index) => {
									return (
										<TouchableNativeFeedback  key={index} onPress={() => {
											setShow(false);
											setValue(val);
										}}>
											<DropdownListValue>
												{val}
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
