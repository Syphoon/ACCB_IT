import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import app from '../styles';
import {heightPercentageToDP as wp} from 'react-native-responsive-screen';
import Forms from '../components/formik.js';
import Realm from '../service/realm';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      values: {},
      products: [],
      open: 0,
    };
  }

  product_info = (type) => {
    if (type == 1) {
      return (
        <View style={{...app.container_items, width: '44%'}}>
          <Text
            style={{
              ...app.text,
              margin: 3,
              backgroundColor: '#fff',
              borderRadius: 5,
              color: '#000',
            }}>
            PREÇO
          </Text>
          <Text
            style={{
              ...app.text,
              borderWidth: 1,
              borderColor: '#fff',
              margin: 3,
              borderRadius: 5,
            }}>
            15,30R$
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{...app.container_items, width: '44%'}}>
          <Text
            style={{
              ...app.text,
              margin: 3,
              backgroundColor: '#fff',
              borderRadius: 5,
              color: '#000',
            }}>
            PREÇO
          </Text>
          <Text
            style={{
              ...app.text,
              borderWidth: 1,
              borderColor: '#fff',
              margin: 3,
              borderRadius: 5,
            }}>
            00,00 R$
          </Text>
        </View>
      );
    }
  };

  product_button = async () => {
    const realm = await Realm();
    const data = realm.objects('Produtos');
    this.setState({products: data});
  };

  list_button = () => {
    return this.state.products.map((values) => {
      return (
        <TouchableOpacity
          key={values.id}
          onPress={() => this.setState({modalVisible: true, open: values.id})}>
          <Text
            key={values.nome}
            style={{
              ...app.button_product,
              color: 'black',
              backgroundColor: '#fff',
            }}>
            {values.nome}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  componentDidMount() {
    this.product_button();
  }

  save_products = (values) => {
    const open = this.state.open;
    const obj = this.state.values;
    // console.log(values);
    Object.assign(obj, {[open]: values});
    this.setState({values: obj});
    console.log(this.state.values);
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <SafeAreaView style={{...app.four_color, flex: 1}}>
        <View style={{...app.item_side, marginLeft: '5%'}}>
          <Image style={app.logo_small} source={require('../img/logo.png')} />
          <Image style={app.logo_small} source={require('../img/logo_2.png')} />
        </View>
        <View
          style={{
            ...app.container_banner,
          }}>
          <View style={app.text_wrapper}>
            <Text style={{...app.text_banner, ...app.one_color}}>
              {/* Bem vindo Mônica, abaixo você encontrará os produtos da atual
              coleta do mês de Outubro. Selecione um produto para preencher o
              formulário e realize uma ação para continuar.  */}
              (O formulário abaixo é um exemplo de itens não preenchidos, ou
              seja, os preenchidos coloridos e os não preenchidos sem cor de
              fundo).
            </Text>
          </View>
        </View>
        <View style={{...app.container_items}}>{this.list_button()}</View>
        <View style={{...app.container_items, marginTop: wp('-7%')}}>
          <TouchableOpacity onPress={() => navigate('Coleta')}>
            <Text style={{...app.button_menu}}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Coleta')}>
            <Text style={{...app.button_menu}}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View style={app.modal_view}>
            <View style={app.modal_content}>
              <Text style={{...app.modal_title, ...app.one_color}}>
                Preços do Produto
              </Text>
              <View
                style={{
                  ...app.container_items,
                  marginTop: wp('5%'),
                  marginBottom: wp('5%'),
                  ...app.one_color,
                  paddingVertical: wp('3%'),
                }}>
                <Forms
                  close_modal={() =>
                    this.setState({
                      modalVisible: !this.state.modalVisible,
                    })
                  }
                  open={this.state.open}
                  save={this.save_products}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
