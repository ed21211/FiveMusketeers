import {getData, setData} from './dataStore'

/**
 * Description: Function to create an order from the buyer's provided details
 * @param {*} email 
 * @param {*} ordersList 
 * @param {*} deliveryAddress 
 * @param {*} totalCost 
 * @returns 
 */
export function createOrder (email, ordersList, deliveryAddressProvided) {
  let data = getData();
  let totalCostCalculated = 0.0;
  for (const order of ordersList) {
    totalCostCalculated += parseFloat(order.productCost) * parseFloat(order.productQuantity);
  }
  const returnObj = {
    emailId: email,
    listOfOrders: ordersList,
    deliveryAddress: deliveryAddressProvided,
    totalCost: totalCostCalculated,
    orderId: Math.floor(Math.random() * 21345),
    orderStatus: "created"
  };
  
  if (!validEmail(email)) {
    return {
      code: 400,
      error: 'Invalid email'
    }
  }

  if (!validOrdersList(ordersList)) {
    return {
      code: 400,
      error: 'Invalid order list'
    }
  }

  if (!validAddress(deliveryAddressProvided)) {
    return {
      code: 400,
      error: 'Invalid delivery address'
    }
  }

  data.Users.push(returnObj);
  setData(data);

  return {
    code: 201,
    error: 'Order created successfully'
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions

function validEmail (email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email === '' || !(emailRegex.test(email)) || email === null || email === undefined) {
    return false;
  }
  return true ;
}

function validOrdersList(orderList) {
  if (orderList.length === 0 || orderList === null || orderList === undefined) {
    return false;
  }
  return true;
}

function validAddress(address) {
  if (address === '' || address === null || address === undefined) {
    return false;
  }
  return true;
}
