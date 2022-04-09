declare module '*.png';
declare module '*.svg' {
	import { SvgProps } from 'react-native-svg';

	const content: React.FC<SvgProps>;

	export default content;
}

declare module '@env' {
	export const SERVER_HOST: string;
	export const URL: string;
}
