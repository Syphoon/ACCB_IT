
export default class Coletas {

	static schema = {
		name: 'Coletas',
		primaryKey: 'id',
		properties: {
			id: { type: 'int', indexed: true },
			coleta_preco_cesta: 'double',
			estabelecimento_cidade: 'string',
			estabelecimento_id: 'int',
			estabelecimento_nome: 'string',
			estabelecimento_secundario: 'string',
			bairro_nome: 'string',
			pesquisa_id: 'int',
			coleta_data: 'string',
			coleta_fechada: 'int',
		},
	};

}
