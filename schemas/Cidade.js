

export default class Cidades {

	static schema = {
	name: 'Cidades',
	primaryKey: 'id',
	properties: {
		id : {type: 'int', indexed: true },
		nome: 'string',
	},
	};
	
}
