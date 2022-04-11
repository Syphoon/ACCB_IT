

const helpers = {
	formatSelect: (text: string) => {
		let dots = "";
		let stop = 12;
		if (text) {
			if (text.length >= 20) {
				dots = "..."
				stop = 19;
			}
 			return text.length >= 11 ? `${text.slice(0, stop)} ${dots}` : text;
		}
		return text
	},
	formatDate: (text: string) => {
		if(text.length > 0)
			return text.split("-").reverse().join("-");
		return text
	},
	formatPriceForm: (text: string) => {
		if(text)
			return text.replace(",", "");
		return text
	}
}

export default helpers;
