import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from 'src/config/storage';

export const setStoreData = async (value:string | object, key: string) => {
  try {
		value = JSON.stringify(value);
		await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
}


export const getStoreData = async (key: string) => {
  try {
		const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

export const getStoreState = async () => {
		const page = await getStoreData(storage.page);
		const params = await getStoreData(storage.params);
		const price = await getStoreData(storage.price);

		// console.log({ page, params, price });
		return [page, params, price];
}

export const resetStore = async () => {
		await setStoreData("", storage.page);
		await setStoreData("", storage.params);
		await setStoreData("", storage.price);
}
