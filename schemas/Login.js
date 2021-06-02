export default class Login {
    static schema = {
        name: 'Login',
        primaryKey: 'user_id',
        properties: {
            user_id: { type: 'int', indexed: true },
            username: 'string',
            logged: 'int',
        },
    };
}