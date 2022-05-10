import * as axios from 'axios';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Realm from 'src/services/realm';

var apiUrl = "http://192.168.15.17:80";

const get_url_api = async() => {
    const api = "https://otakuheavenserver.herokuapp.com/accb_url";
    var return_value = "";
    await axios.get(
        api, {
            timeout: 1000 * 2,
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then(function(response) {
        console.log(response.data);
        return_value = response.data.url;
    }).catch(function(error) {
        if (error) {
            console.log({ error });
        }
        return false;
    });
    return return_value;
}

export const check_backup = async(type) => {
    const realm = await Realm();
    const data = realm.objects(type);
    try {
        if (data[0] == undefined) {
            return true;
        }

        return false;
    } catch (e) {
        return false;
    }
};

export const save_app = async(month, year, active = 0) => {
    const realm = await Realm();
    try {
        realm.write(() => {
            realm.create(
                'Aplicativo', {
                    ativo: active,
                    data: `${month}/${year}`,
                    mes: String(month),
                    ano: String(year),
                },
                'modified',
            );
        });
    } catch (e) {
        console.log('Erro ao salvar novo estado do Aplicativo.');
        console.log(e);
    }
};

export const save_product = async(product) => {
    const realm = await Realm();
    try {
        realm.write(() => {
            realm.create(
                'Produtos', { id: parseInt(product.id), nome: String(product.nome) },
                'modified',
            );
        });
    } catch (e) {
        console.log('Erro ao salvar produtos.');
    }
};

export const save_city = async(city) => {
    const realm = await Realm();
    try {
        realm.write(() => {
            realm.create(
                'Cidades', { id: parseInt(city.id), nome: String(city.nome) },
                'modified',
            );
        });
    } catch (e) {
        console.log('Erro ao salvar Cidades.');
    }
};

export const save_user = async(user, id, logged = 0) => {
    const realm = await Realm();
    try {
        realm.write(() => {
            realm.create(
                'Usuarios', {
                    id: id,
                    usuario: String(user.username),
                    senha: String(user.password),
                    logado: logged,
                },
                'modified',
            );
        });
    } catch (e) {
        console.log('Erro ao salvar usuarios.');
        console.log(e);
    }
};

export const save_research_state = async(
    research,
    send = false,
    value = false,
) => {
    const realm = await Realm();
    if (send) {
        try {
            realm.write(() => {
                realm.create(
                    'Coletas', {
                        id: parseInt(research.id),
                        enviar: value,
                    },
                    'modified',
                );
            });
        } catch (e) {
            console.log('Erro ao salvar estado das coletas.' + e);
            return false;
        }
    } else {
        try {
            realm.write(() => {
                realm.create(
                    'Coletas', {
                        id: parseInt(research.id),
                        coleta_fechada: 1,
                    },
                    'modified',
                );
            });
        } catch (e) {
            console.log('Erro ao fechar coletas.' + e);
            return false;
        }
    }

    return true;
};

export const save_research = async(research) => {
    const realm = await Realm();
    try {
        realm.write(() => {
            realm.create(
                'Coletas', {
                    id: parseInt(research.coleta_id),
                    coleta_preco_cesta: research.coleta_preco_cesta == null ?
                        parseFloat(0) : parseFloat(research.coleta_preco_cesta),
                    estabelecimento_cidade: research.estabelecimento_cidade,
                    estabelecimento_id: parseInt(research.estabelecimento_id),
                    estabelecimento_nome: research.estabelecimento_nome,
                    estabelecimento_secundario: research.estabelecimento_secundario[0] != undefined ?
                        JSON.stringify(research.estabelecimento_secundario) : 'Não tem estabelecimento secundário',
                    pesquisa_id: parseInt(research.pesquisa_id),
                    bairro_nome: research.bairro_nome,
                    coleta_data: research.coleta_data,
                    coleta_fechada: research.coleta_fechada == null ?
                        0 : parseInt(research.coleta_fechada),
                    enviar: false,
                },
                'modified',
            );
        });
    } catch (e) {
        console.log('Erro ao salvar coletas.');
        console.log(e);
    }
};

export const list_data = async(data_name) => {
    const realm = await Realm();
    console.log('list_data');
    const data = realm.objects(data_name);

    data.map(value => {
        if (data_name == 'Usuarios') {
            console.log(value.usuario);
            console.log(value.senha);
        } else if (data_name == 'Produtos' || data_name == 'Cidades') {
            console.log(value.nome);
        } else if (data_name == 'Coletas') {
            console.log(value.coleta_data);
            console.log(value.estabelecimento_nome);
        }
    });
};

export const get_data = async(data_name) => {
    const realm = await Realm();
    const data = realm.objects(data_name);
    return data;
};

export const delete_collect_info = async() => {
    const realm = await Realm();

    let collect = await get_data('Coletas');
    let form = await get_data('Formularios');

    realm.write(() => {
        realm.delete(collect);
        realm.delete(form);
    });

    await save_app('', '', 0);
    await get_date_sync();
};

export const delete_db_info = async() => {
    const realm = await Realm();

    realm.write(() => {
        realm.deleteAll();
    });
};

export const validate_date = async() => {
    let date = await get_date_sync(false);
    if (typeof date === 'boolean') {
        return !date;
    }

    let app_date = await get_data('Aplicativo');

    try {
        app_date = app_date.filtered('ativo == 1');
        if (app_date[0].data == `${date.mes}/${date.ano}`) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        // console.log("Data inexistente no aplicativo\n" + e);
        return true;
    }
};

export const get_date_sync = async(save = true) => {
    if (!__DEV__)
        apiUrl = await get_url_api();
    return (
        await axios
        .get(`${apiUrl}/request_it.php/?&accb_it_date`, {
            timeout: 1000 * 0.5,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        // .get(`http://192.168.15.17:80/request_it.php/?&accb_it_date`)
        .then(async function(response) {
            let json = response.data;
            if (save) {
                await save_app(json.mes, json.ano, 1);
            }

            return json;
        })
        .catch(function(error) {
            if (error.response) {
                console.log(
                    'Não foi possível realizar a requisição.\n',
                    error.response.data,
                );
            } else {
                console.log('Não foi possível realizar a requisição.', error.message);
            }

            return false;
        })
    );
};

export const get_sync_data = async(type, refresh = false) => {
    let sync = type == 'users' ? 'user' : 'collect';
    let coletas;
    if (refresh) {
        coletas = await get_data('Coletas');
    }

    // console.log('sync');
    if (!__DEV__)
        apiUrl = await get_url_api();
    return (
        await axios
        .get(
            `${apiUrl}/request_it.php/?&accb_it_sync=${sync}`, {
                timeout: 1000 * 2,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        // .get(`http://192.168.15.17:80/request_it.php/?&accb_it_sync=${sync}`)
        .then(function(response) {
            let json = response.data;

            if (type == 'users') {
                json.produtos.map(produto => {
                    save_product(produto);
                });

                // list_data('Produtos');

                json.usuarios.map((usuario, key) => {
                    save_user(usuario, key);
                });

                // list_data('Usuarios');
                return true;
            } else {
                if (refresh) {
                    console.log("refresh");
                    try {
                        json.coletas.map(coleta => {
                            // console.log(coleta.estabelecimento_secundario[0] != undefined ? JSON.stringify(coleta.estabelecimento_secundario) : "Não tem estabelecimento secundário");
                            let check_coleta = coletas.filtered(
                                `id = ${coleta.coleta_id} && pesquisa_id = ${coleta.pesquisa_id}`
                            );
                            if (typeof check_coleta[0] == "object") {
                                if (check_coleta[0].coleta_fechada == 0 && check_coleta[0].enviar == false)
                                    save_research(coleta);
                            } else {
                                save_research(coleta);
                            }
                            // console.log(check_coleta[0].estabelecimento_nome);
                            // if (check_coleta[0].estabelecimento_secundario == undefined) {
                            //     console.log(check_coleta);
                            // }
                        });
                    } catch (e) {
                        return 'Nenhuma coleta existente no momento.';
                        // return false;
                    }
                } else {
                    get_date_sync();

                    try {
                        json.coletas.map(coleta => {
                            // console.log(coleta.estabelecimento_secundario[0] != undefined ? JSON.stringify(coleta.estabelecimento_secundario) : "Não tem estabelecimento secundário");
                            save_research(coleta);
                        });
                    } catch (e) {
                        return 'Nenhuma coleta existente no momento.';
                        // return false;
                    }
                }
                // // list_data('Coletas');

                json.cidades.map(cidade => {
                    save_city(cidade);
                });
                // list_data('Cidades');
                return true;
            }
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log('Não foi possível realizar a requisição.', error.message);
            }

            return false;
        })
    );
};

export const send_prices = async(info) => {
    if (!__DEV__)
        apiUrl = await get_url_api();
    return (
        await axios
        .post(
            `${apiUrl}/request_it.php/?&accb_it_prices`, {
                data: info,
            }, {
                timeout: 1000 * 2,
            },
        )
        // .get('http://192.168.15.17:80/request_it.php/?&accb_it_prices')
        .then(function(response) {
            let message = response.data == 1 ? true : false;
            return response.data == -1 ? 'Coleta Fechada.' : message;
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log('Não foi possível realizar a requisição.', error.message);
            }

            return 'Não foi possível se comunicar com o banco de dados ACCB.';
        })
    );
};

export const loading_screen = (
    // delete_db_info();
    <
    View >
    <
    Text >
    Sincronizando App com o Banco de Dados ACCB <
    /Text> <
    ActivityIndicator size = "large"
    color = "#fff" / >
    <
    /View>
);