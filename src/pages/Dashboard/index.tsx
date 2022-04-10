import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Gradient from 'src/components/Gradient';
import Dropdown from 'src/components/Dropdown';
import colors from 'src/config/colors';
import { ColetaContainer, ColetaItem, ColetaValue, Commands, CommandsContainer, CommandsIconContainer, CommandsValue, Container, IconContainer, Legend, Logo, SelectContainer, TopMenu } from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Alert, Pressable, Text, TouchableWithoutFeedback, View} from 'react-native';
import { Button } from 'react-native-elements';

const accbLogo = "../../assets/logos/accb.png";
const uescLogo = "../../assets/logos/uesc.png";


const Dashboard: React.FC = () => {

	const [estab, setEstab] = useState("");
	const [hideDropdown, setHideDropdown] = useState(false);
	const [estabList, setEstabList] = useState<any>([]);
	const navigation = useNavigation();
	const arr = [
		"aa",
		"aaa",
		"aaaa",
		"aaaaaasdfasdfasdfasdfasdfsa",
		"aaaa",
		"aaaaaasdfasdfasdfasdfasdfsa",
		"aaaa",
		"aaaaaasdfasdfasdfasdfasdfsa",
		"aaaa",
		"aaaaaasdfasdfasdfasdfasdfsa",
	];
	const coleta = [
		{
			estab: "askodasp",
			bairro: "asdkoasp",
			data: "20/10/2020"
		},
		{
			estab: "askodasp",
			bairro: "asdkoasp",
			data: "20/10/2020"
		},
		{
			estab: "askodasp",
			bairro: "asdkoasp",
			data: "20/10/2020"
		},
		{
			estab: "askodasp",
			bairro: "asdkoasp",
			data: "20/10/2020"
		},
		{
			estab: "askodasp",
			bairro: "asdkoasp",
			data: "20/10/2020"
		},
	]
	useEffect(() => {
		setEstabList(arr);
		setEstab(arr[0]);
	}, []);

	const DashboardContent = (
		<>
			<TopMenu >
				<Container>
					<Logo source={require(uescLogo)} />
					<Logo source={require(accbLogo)} />
				</Container>
				<Container style={{justifyContent: "flex-end"}}>
					<IconContainer style={{"borderRadius": 100, "paddingHorizontal": 22, "paddingVertical": 13}}>
						<Icon
							color={'rgba(255,255,255,1)'}
							// color={colors.secondary_lighter}
							name={'info'}
							size={25}
						/>
					</IconContainer>
					<IconContainer  style={{"borderRadius": 100, "paddingHorizontal": 15, "paddingVertical": 13}}>
						<Icon
							color={'rgba(255,255,255,1)'}
							// color={colors.secondary_lighter}
							name={'sign-out'}
							size={25}
						/>
					</IconContainer>
				</Container>
			</TopMenu>
			<Legend>
				Selecione <Text style={{ fontWeight: 'bold' }}>Iniciar Coleta</Text> para mover-se ao formulário do estabelecimento.
			</Legend>
			<SelectContainer>
				<Dropdown hide={hideDropdown} options={estabList} value={estab} setValue={setEstab}/>
				<Dropdown hide={hideDropdown} options={estabList} value={estab} setValue={setEstab}/>
			</SelectContainer>
			<ColetaContainer>
				{
					coleta.map((item, index) => {
						return (
						<View  key={index + "col"}>
							<ColetaItem >
								<ColetaValue>
									{item.estab}
								</ColetaValue>
								<ColetaValue style={{marginTop: 5}}>
									{item.bairro}
								</ColetaValue>
								<ColetaValue style={{marginTop: 5}}>
									{item.data}
								</ColetaValue>
							</ColetaItem>
							<CommandsContainer>
								<Commands  onPress={() => navigation.navigate("Coleta")}>
									<CommandsIconContainer>
										<Icon
											color={'rgba(255,255,255,1)'}
											// color={colors.secondary_lighter}
											name={'shopping-cart'}
											size={20}
										/>
									</CommandsIconContainer>

									<CommandsValue>
										Iniciar Coleta
									</CommandsValue>

								</Commands>
								<Commands>
									<CommandsIconContainer>
										<Icon
											color={'rgba(255,255,255,1)'}
											// color={colors.secondary_lighter}
											name={'send'}
											size={20}
										/>
									</CommandsIconContainer>
									<CommandsValue>
										Enviar Coleta
									</CommandsValue>
								</Commands>
							</CommandsContainer>
						</View>
						)
					})
				}
			</ColetaContainer>
		</>
	);

	return (

		<Gradient
		style={{ justifyContent: "flex-start", zIndex: -2 }}
		colors={[colors.primary, colors.primary, colors.secondary_lighter]}
		children={DashboardContent} />

	);
};

export default Dashboard;
