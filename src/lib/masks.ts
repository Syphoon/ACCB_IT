const masks = {
	formatPrice: (price: string) => {
		if (!price)
			return price
		const value = price.replace(",", "");
		if(value.length == 4)
			return value.replace(/^(\d{2})(\d{2})*/, '$1,$2');
		if(value.length == 3)
			return value.replace(/^(\d{1})(\d{2}).*/, '$1,$2');
		if(value.length <= 2)
			return value
	},
};

// 11
export default masks;
