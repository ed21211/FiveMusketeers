import request from 'sync-request-curl';
import config from './config.json';

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;


// Test wrapper for adminAuthRegister
export function createOrderWrapper (email, ordersList, deliveryAddressProvided) {
	const res = request(
	  'POST',
	  SERVER_URL + '/buyer/createOrder',
	  {
		json: {
		  email,
		  ordersList,
		  deliveryAddressProvided
		},
		// adding a timeout will help you spot when your server hangs
		timeout: 100
	  }
	);
	return JSON.parse(res.body.toString());
}
  

export function clearWrapper () {
	const res = request(
	  'DELETE',
	  SERVER_URL + '/clear'
	);
	return JSON.parse(res.body.toString());
}
  