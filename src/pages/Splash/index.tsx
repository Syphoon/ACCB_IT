import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import Gradient from 'src/components/Gradient';
import colors from 'src/config/colors';
import { Legend, Logo, LogoContainer } from './styles';

const accbLogo = "../../assets/logos/accb.png";
const uescLogo = "../../assets/logos/uesc.png";

const Splash: React.FC = () => {

	const navigation = useNavigation();

	useEffect(() => {
		setTimeout(() => {
			navigation.replace('Login');
		}, 2000);

	}, []);

	const SplashContent = (
		<>
			<LogoContainer>
				<Logo source={require(accbLogo)} />
				<Logo source={require(uescLogo)} />
			</LogoContainer>
			<Legend allowFontScaling={true}>
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
