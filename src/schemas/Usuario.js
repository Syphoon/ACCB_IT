export default class Usuarios {
    static schema = {
        name: 'Usuarios',
        primaryKey: 'id',
        properties: {
            id: { type: 'int', indexed: true },
            usuario: { type: 'string', indexed: true },
            senha: 'string',
            logado: 'int',
        },
    };
}