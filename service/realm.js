import Realm from 'realm';

import Produtos from '../schemas/Produto';
import Usuarios from '../schemas/Usuario';
import Coletas from '../schemas/Coleta';
import Cidades from '../schemas/Cidade';
import Formularios from '../schemas/Formulario';

export default function getRealm() {
	// return Realm.open({
	// 	schema: [Produtos, Usuarios, Coletas, Cidades, Formularios],
	// 	schemaVersion: 11, //add a version number
	// 	migration: (oldRealm, newRealm) => {

	// 		if (oldRealm.schemaVersion < 1) {
	// 			const oldObjects = oldRealm.objects('schema');
	// 			const newObjects = newRealm.objects('schema');

	// 			// loop through all objects and set the name property in the new schema
	// 			for (let i = 0; i < oldObjects.length; i++) {
	// 				newObjects[i].otherName = 'otherName';
	// 			}
	// 		}

	// 	},
	// });

	return Realm.open({
		schema: [Produtos, Usuarios, Coletas, Cidades, Formularios],
		schemaVersion: 11,
	});
}
