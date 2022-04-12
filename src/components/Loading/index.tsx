import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import colors from 'src/config/colors';
import fonts from 'src/config/fonts';

const LoadingScreen: React.FC = () => {

	return (
		<View >
			<Text style={{ textAlign: 'center', fontFamily: fonts.primary, color: colors.white, fontSize: 15, marginBottom: 20 }} allowFontScaling={true}>
				Sincronizando App {'\n'} com o  Banco de Dados ACCB
			</Text>
			<ActivityIndicator size="large" color="#fff" />
		</View>
	);
};

export default LoadingScreen;
