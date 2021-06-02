export default class Formularios {
    static schema = {
        name: 'Formularios',
        primaryKey: 'form_id',
        properties: {
            form_id: { type: 'int', indexed: true },
            values: 'string',
            values_keys: 'int[]',
            coleta_id: 'int',
            pesquisa_id: 'int',
            estabelecimento_id: 'int',
        },
    };
}