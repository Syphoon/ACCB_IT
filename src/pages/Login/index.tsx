import React, { useEffect, useState } from 'react';
import { App, ButtonContainer, ButtonText, Container, IconContainer,InputContainer, Logo, Subtitle, TopMenu } from './styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from 'src/config/colors';

const accbLogo = "../../assets/logos/accb.png";
import InputWithIconComponent from 'src/components/InputWithIcon';

const Home: React.FC = () => {

	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");

	return (
		<App colors={['#4c669f', '#3b5998', '#192f6a']} >
			<TopMenu>
				<IconContainer style={{"borderRadius": 100, "paddingHorizontal": 20, "paddingVertical": 10}}>
					<Icon
						// color={'rgba(255,255,255,0.8)'}
						color={'#2196F3'}
						name={'info'}
						size={25}
					/>
				</IconContainer>
				<IconContainer  style={{"borderRadius": 100, "padding": 13}}>
					<Icon
						// color={'rgba(255,255,255,0.8)'}
						color={'#2196F3'}
						name={'refresh'}
						size={25}
					/>
				</IconContainer>
			</TopMenu>
			<Container>
				<Logo source={require(accbLogo)} />
				<Subtitle>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus distinctio atque, ipsam.</Subtitle>
				<InputContainer>
					<InputWithIconComponent placeholder='Usuário' icon='user' color='#fff' value={userName} setValue={setUserName} />
					<InputWithIconComponent placeholder='Senha' icon='lock' color='#fff' value={password} setValue={setPassword} />
				</InputContainer>
				<ButtonContainer>
					<ButtonText>Entrar</ButtonText>
				</ButtonContainer>
			</Container>
		</App>
	);
};

export default Home;
