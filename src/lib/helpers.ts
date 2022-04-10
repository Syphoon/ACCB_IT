

const helpers = {
	formatSelect: (text: string) => {
		return text.length >= 11 ? `${text.slice(0, 12)} ...` : text;
	},
	formatDate: (text: string) => {
		return text.split("-").reverse().join("-");
	}
}

export default helpers;
