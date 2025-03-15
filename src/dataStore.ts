import { save } from './saveData';

export interface Timer {
	sessionId: number,
	timer?: ReturnType<typeof setTimeout>,
}

export interface Users {
    emailId: string,
    listOfOrders: Products[],
    deliveryAddress: string,
    totalCost: number,
    orderId: number,
    orderStatus: string
};

export interface Products {
	productQuantity: number,
	productCost: number
}
  
let data: any = {
	Users: [],
	Products:[]
};
  
// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: any) {
	data = newData;
	save();
}
  
// Use get() to access the data
function getData() {
	return data;
}
  
export { getData, setData };
