const { DynamoDB } = require('aws-sdk')
const db = new DynamoDB.DocumentClient()

const headers = {
  "Access-Control-Allow-Origin": "*"
}


//Database Import Function

exports.handler = async (event) => {
  const users = await db.scan({TableName: "Users"}).promise();
  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(users),
  };
};


// Login Function

exports.login = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  //     password: string
  // }

  const data = JSON.parse(event.body)
  
  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  if (!user) {
      return {
        headers: headers,
          statusCode: 404,
          body: JSON.stringify("Empty")
      }
  }

  if (user.Password === data.password) {
    return {
      headers: headers,
        statusCode: 200,
        body: JSON.stringify(user.UserID)
    }
  }
  else {
    return {
      headers: headers,
        statusCode: 422,
        body: JSON.stringify("Empty")
    }
  }
}


// Sign up function

exports.registerUser = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  //     name: string,
  //     email: string,
  //     password: string
  // }

  const data = JSON.parse(event.body)

  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  if (typeof user !== 'undefined') {
    return {
      headers: headers,
      statusCode: 422,
      body: JSON.stringify("Username Already Exists")
    }
  }

  const newUser = {
    UserID : data.UserID,
    Name : data.name,
    Email : data.email,
    Password : data.password,
    Cash : 0,
    Stock : [],
    History : [],
    isAdmin : false
  }

  const params = {
      Item: newUser,
      TableName: "Users"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(newUser)
  }
}


//Add Cash Function

exports.addCash = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  //     amount: number
  // }

  const data = JSON.parse(event.body)
  
  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  if (!user) {
      return {
        headers: headers,
          statusCode: 404,
          body: JSON.stringify("User Not Found")
      }
  }

  const newCash = Number(user.Cash) + Number(data.amount);

  Object.assign(user, { Cash: newCash });

  const params = {
      Item: user,
      TableName: "Users"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(user)
  }
}


//Withdraw Cash Function

exports.withdrawCash = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  //     amount: number
  // }

  const data = JSON.parse(event.body)
  
  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  if (!user) {
      return {
        headers: headers,
          statusCode: 404,
          body: JSON.stringify("User Not Found")
      }
  }

  if(data.amount > user.Cash) {
      return {
        headers: headers,
          statusCode: 422,
          body: JSON.stringify("Invalid Amount")
      }
  }

  const newCash = Number(user.Cash) - Number(data.amount);

  Object.assign(user, { Cash: newCash });

  const params = {
      Item: user,
      TableName: "Users"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(user)
  }
}


//Buy stock function

exports.buyStock = async (event) => {
    
  // Expecting:
  // {
  //     UserID: string,
  //     StockTicker: string,
  //     amount: number
  // }

  const data = JSON.parse(event.body)
  
  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  if (!user) {
      return {
        headers: headers,
          statusCode: 404,
          body: JSON.stringify("User Not Found")
      }
  }

  const allArrays = await db.scan({ TableName: "StockArray" }).promise();
  const array = allArrays.Items.filter(array => data.ArrayID === array.ArrayID)[0];;

  let owned = user.Stock.find(i => i.Stock === data.StockTicker)

  let target = array.Stocks.find(i => i.StockTicker === data.StockTicker)

  if(!owned) {
    const newStock = {
        Stock : data.StockTicker, 
        Volume : data.amount
      }

      user.Stock.push(newStock)
  }
  else{
    owned.Volume = Number(owned.Volume) + Number(data.amount);
  }

  const newHistory = {
    Stock : data.StockTicker, 
    Volume : "+ " + data.amount,
    Date: Date()
  }

  user.History.push(newHistory)

  const newCash = Number(user.Cash) - (Number(data.amount) * Number(target.Price))

  Object.assign(user, { Cash: newCash });

  const params = {
      Item: user,
      TableName: "Users"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(user)
  }
}


//Sell Stock Function

exports.sellStock = async (event) => {

  // Expecting:
  // {
  //     ArrayID: string,
  //     UserID: string,
  //     StockTicker: string,
  //     amount: number
  // }

  const data = JSON.parse(event.body)
  
  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];


  const allArrays = await db.scan({ TableName: "StockArray" }).promise();
  const array = allArrays.Items.filter(array => data.ArrayID === array.ArrayID)[0];;


  let owned = user.Stock.find(i => i.Stock === data.StockTicker)

  let target = array.Stocks.find(i => i.StockTicker === data.StockTicker)

  owned.Volume = Number(owned.Volume) - Number(data.amount);

  const newHistory = {
    Stock : data.StockTicker, 
    Volume : "- " + data.amount,
    Date: Date()
  }

  user.History.push(newHistory)

  const newCash = Number(user.Cash) + (Number(data.amount) * Number(target.Price))

  Object.assign(user, { Cash: newCash});

  const params = {
      Item: user,
      TableName: "Users"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(user, array)
  }

}


//Create Stock Function 

exports.createStock = async (event) => {

  // Expecting:
  // {
  //     StockTicker: string,
  //     ArrayID: string
  //     name: string,
  //     price: number,
  //     volume: number
  // }

  const data = JSON.parse(event.body)
  
  const newStock = {
      StockTicker : data.StockTicker,
      StockName : data.name,
      Price : Number(data.price),
      Volume : Number(data.volume),
      MarketCap: (Number(data.price) * Number(data.volume)),
      StartingPrice : Number(data.price),
      MarketHigh: Number(data.price),
      MarketLow: Number(data.price)
  }

  const allArrays = await db.scan({ TableName: "StockArray" }).promise();
  const array = allArrays.Items.filter(array => data.ArrayID === array.ArrayID)[0];;

  let stock = array.Stocks.find(i => i.StockTicker === data.StockTicker)

  if (typeof stock !== 'undefined') {
    return {
      headers: headers,
      statusCode: 422,
      body: JSON.stringify("Stock Already Exists")
    }
  }

  array.Stocks.push(newStock)

  const params = {
    Item: array,
    TableName: "StockArray"
};

await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(newStock)
  }
}


//Unused Function

exports.changeHours = async (event) => {

  // Expecting:
  // {
  //     MarketID: string,
  //     newMarketSchedule: string
  // }

  const data = JSON.parse(event.body)

  const markets = await db.scan({ TableName: "MarketRules" }).promise();
  const market = markets.Items.filter(market => data.MarketID === market.MarketID)[0];

  if (!market) {
      return {
        headers: headers,
          statusCode: 404,
          body: JSON.stringify("Entry Not Found")
      }
  }

  if(data.newMarketSchedule === market.Schedule){
    return {
      headers: headers,
        statusCode: 422,
        body: JSON.stringify("Schedule is the Same")
    }
  }

  Object.assign(market, { Schedule: data.newMarketSchedule });

  const params = {
      Item: market,
      TableName: "MarketRules"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(market)
  }
}


//Change Market Schedule

exports.changeSchedule = async (event) => {

  // Expecting:
  // {
  //     MarketID: string,
  //     Monday: string,
  //     Tuesday: string,
  //     Wednesday: string,
  //     Thursday: string,
  //     Friday: string,
  //     Satday: string,
  //     Sunday: string
  // }

  const data = JSON.parse(event.body)
  
  const markets = await db.scan({ TableName: "MarketRules" }).promise();
  const market = markets.Items.filter(market => data.MarketID === market.MarketID)[0];;

  if (!market) {
      return {
        headers: headers,
          statusCode: 404,
          body: JSON.stringify("Entry Not Found")
      }
  }

  Object.assign(market, { 
    Monday: data.Monday,
    Tuesday: data.Tuesday,
    Wednesday: data.Wednesday,
    Thursday: data.Thursday,
    Friday: data.Friday,
    Saturday: data.Saturday,
    Sunday: data.Sunday
  });

  const params = {
      Item: market,
      TableName: "MarketRules"
  };

  await db.put(params).promise()
  return {
    headers: headers,
      statusCode: 200,
      body: JSON.stringify(market)
  }
}


//List All Purchased Stocks

exports.listPortfolio = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  // }

  const data = JSON.parse(event.body)

  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(user.Stock)
}

}


//List All Past Transactions

exports.listHistory = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  // }

  const data = JSON.parse(event.body)

  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(user.History)
}

}

exports.getCash = async (event) => {

  // Expecting:
  // {
  //     UserID: string,
  // }

  const data = JSON.parse(event.body)
  
  const allUsers = await db.scan({ TableName: "Users" }).promise();
  const user = allUsers.Items.filter(user => data.UserID === user.UserID)[0];

  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(user.Cash)
  }
}

exports.getMarketSchedule = async (event) => {

  // Expecting:
  // {
  //     MarketID: string,
  // }

  const data = JSON.parse(event.body)
  
  const markets = await db.scan({ TableName: "MarketRules" }).promise();
  const market = markets.Items.filter(market => data.MarketID === market.MarketID)[0];;
  
  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(market)
  }
}

//List All Past Transactions

exports.listStocks = async (event) => {

  // Expecting:
  // {
  //     ArrayID: string,
  // }

  const data = JSON.parse(event.body)

  const allArrays = await db.scan({ TableName: "StockArray" }).promise();
  const array = allArrays.Items.filter(array => data.ArrayID === array.ArrayID)[0];;

  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(array.Stocks)
}

}



exports.marketSIM = async () => {

  const allArrays = await db.scan({ TableName: "StockArray" }).promise();
  const array = allArrays.Items.filter(array => "1" === array.ArrayID)[0];;

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < array.Stocks.length; i++) {

    array.Stocks[i].Price = Math.round(Number(array.Stocks[i].Price) * getRandomArbitrary(Number(0.7),Number(1.6)))


    array.Stocks[i].MarketCap = Number(array.Stocks[i].Price) * Number(array.Stocks[i].Volume)

    if(array.Stocks[i].Price > array.Stocks[i].MarketHigh){
        array.Stocks[i].MarketHigh = array.Stocks[i].Price
    }

    if(array.Stocks[i].Price < array.Stocks[i].MarketLow){
        array.Stocks[i].MarketLow = array.Stocks[i].Price
  }

  }

  const params = {
    Item: array,
    TableName: "StockArray"
};

await db.put(params).promise()
  return {
    headers: headers,
    statusCode: 200,
}

}

exports.marketSIMTest = async (event) => {

  // Expecting:
  // {
  //     ArrayID: string,
  // }

  const data = JSON.parse(event.body)

  const allArrays = await db.scan({ TableName: "StockArray" }).promise();
  const array = allArrays.Items.filter(array => data.ArrayID === array.ArrayID)[0];;

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < array.Stocks.length; i++) {

    array.Stocks[i].Price = Math.round(Number(array.Stocks[i].Price) * getRandomArbitrary(Number(0.8),Number(1.2)))


    array.Stocks[i].MarketCap = Number(array.Stocks[i].Price) * Number(array.Stocks[i].Volume)

    if(array.Stocks[i].Price > array.Stocks[i].MarketHigh){
        array.Stocks[i].MarketHigh = array.Stocks[i].Price
    }

    if(array.Stocks[i].Price < array.Stocks[i].MarketLow){
        array.Stocks[i].MarketLow = array.Stocks[i].Price
  }

  }

  const params = {
    Item: array,
    TableName: "StockArray"
};

await db.put(params).promise()
  return {
    headers: headers,
    statusCode: 200,
    body: JSON.stringify(array.Stocks)
}

}