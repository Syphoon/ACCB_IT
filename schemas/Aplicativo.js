

export default class Aplicativo {

	static schema = {
		name: 'Aplicativo',
		primaryKey: 'ativo',
		properties: {
			ativo: { type: 'int', indexed: true },
			data: 'string',
			ano: 'string',
			mes: 'string',
		},
	};

}
