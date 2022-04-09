import React, { useEffect, useState } from 'react';
import { App, Button, Container, Icon, Input, InputContainer, Logo, Subtitle, TopMenu } from './styles';

const accbLogo = "../../assets/logos/accb.png";
const infoIcon = "../../assets/info.svg";
const reloadIcon = "../../assets/reload.svg";

const Home: React.FC = () => {

	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");

	return (
		<App>
			<TopMenu>
				<Icon source={require(infoIcon)}/>
				<Icon source={require(reloadIcon)}/>
			</TopMenu>
			<Container>
				<Logo source={require(accbLogo)} />
				<Subtitle>Bem Vindo</Subtitle>
				<InputContainer>
					<Input placeholder="Usuário" value={userName} onChange={(e) => setUserName(e)} />
					<Input type={"password"} value={password} onChange={(e) => setPassword(e)} placeholder="Password"/>
				</InputContainer>
				{/* <Button>
					Entrar
				</Button> */}
			</Container>
		</App>
	);
};

export default Home;
