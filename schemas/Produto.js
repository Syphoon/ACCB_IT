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

// export default class Formularios {
//   static schema = {
//     name: 'Formularios',
//     primaryKey: 'form_id',
//     properties: {
//       form_id: {type: 'int', indexed: true},
//       values: '[]',
//       coleta_id: 'int',
//     },
//   };
// }
