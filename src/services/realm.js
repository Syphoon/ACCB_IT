import Realm from 'realm';

import Produtos from 'src/schemas/Produto';
import Usuarios from 'src/schemas/Usuario';
import Coletas from 'src/schemas/Coleta';
import Cidades from 'src/schemas/Cidade';
import Formularios from 'src/schemas/Formulario';
import Aplicativo from 'src/schemas/Aplicativo';

const migrate = (version) => {

	return Realm.open({
		schema: [Produtos, Usuarios, Coletas, Cidades, Formularios],
		schemaVersion: version, //add a version number
		migration: (oldRealm, newRealm) => {

			if (oldRealm.schemaVersion < 1) {
				const oldObjects = oldRealm.objects('schema');
				const newObjects = newRealm.objects('schema');

				// loop through all objects and set the name property in the new schema
				for (let i = 0; i < oldObjects.length; i++) {
					newObjects[i].otherName = 'otherName';
				}
			}

		},
	});

}

export default function getRealm() {
	const version = 1;
	// return migrate(version)

	return Realm.open({
		schema: [Produtos, Usuarios, Coletas, Cidades, Formularios, Aplicativo],
		schemaVersion: version,
	});
}
