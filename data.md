# DATA STORAGE STRUCTURE
```json
"Orders": [
    {
        "orderId": "string",
        "orderStatus": "[created, updated, accepeted, rejected]", // enum
        "date": {},
        "allowanceInstructions": "string",
        "listOfOrders": {"products.productId",  "quantity"},
        "totalCost": 0.0,
        "trackingNumber": 0,
        "deliveryAddress": "string",
        "deliveryMethod": "string",
        "discountOfferId": "string",
        "orderConfirmation": true
    }
]

"Customers": [
    {
        "orders": "orders.orderId",
        "customerEmailId": "string",
        "signedUp": "boolean",

    }
]

"Products": [
    {
        "productId": 0,
        "productName": "string",
        "productCost": 0.0,
        "stockRemaining": 0
    }
]
```