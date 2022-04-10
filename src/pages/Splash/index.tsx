import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import Gradient from 'src/components/Gradient';
import Alert from 'src/components/notifications/Alert';
import colors from 'src/config/colors';
import AlertContext from 'src/contexts/Alert';
import { Legend, Logo, LogoContainer } from './styles';

const accbLogo = "../../assets/logos/accb.png";
const uescLogo = "../../assets/logos/uesc.png";


const Splash: React.FC = () => {

	const navigation = useNavigation();
	const { notification, openAlert, closeAlert } = useContext(AlertContext);

	useEffect(() => {

		openAlert(
			"ask",
			"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur culpa totam soluta officia iste modi aut dolorem officiis omnis vel, ducimus quae ab sint labore nostrum aliquam sapiente unde! At.",
			"warning",
		);
		// setTimeout(() => c{
		// 	navigation.replace('Login');
		// }, 2000);

	}, []);

	const SplashContent = (
		<>
			<Alert />
			<LogoContainer>
				<Logo source={require(accbLogo)} />
				<Logo source={require(uescLogo)} />
			</LogoContainer>
			<Legend>
				Acompanhamento do Custo da Cesta Básica {'\n'} {'\n'}
				Coleta de Preços {'\n'} {'\n'}
				Projeto Mobile - PIBITI 2020
			</Legend>
		</>
	);

	return (
		<Gradient colors={[colors.primary, colors.primary, colors.secondary_lighter]} children={SplashContent} />
	);
};

export default Splash;
