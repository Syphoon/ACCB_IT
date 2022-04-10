

const helpers = {
	formatSelect: (text: string) => {
		return text.length >= 11 ? `${text.slice(0, 12)} ...` : text;
	}
}

export default helpers;
