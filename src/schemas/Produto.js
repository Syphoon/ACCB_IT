// SCHEMA PRODUTO PARA BACKUP
export default class Produtos {
	static schema = {
		name: 'Produtos',
		primaryKey: 'id',
		properties: {
			id: { type: 'int', indexed: true },
			nome: 'string',
		},
	};
}
