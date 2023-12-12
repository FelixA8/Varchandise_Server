var express = require("express");
var router = express.Router();
var con = require("./database");
const jwt = require("jsonwebtoken");

//ACCOUNTS
//REGISTER LOGIN
router.route("/register").post((req, res) => {
  //get params
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var address = req.body.address;
  console.log(email)

  //create query
  var sqlQuery =
    "INSERT INTO MsCustomer(CustomerName,CustomerAddress,CustomerEmail,CustomerPassword) VALUES (?,?,?,?)";

  //call database to insert so add or include database
  // ???? pass params here
  con.query(
    sqlQuery,
    [name, address, email, password],
    function (error, data, fields) {
      if (error) {
        // if error send response here
        res.send(JSON.stringify({ success: false, message: error }));
      } else {
        // if success send response here
        res.send(JSON.stringify({ success: true, message: "register" }));
      }
    }
  );
});

//USER LOGIN
router.route("/login").post((req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email);
  console.log(password);
  var sql =
    "SELECT * FROM MsCustomer WHERE CustomerEmail=? AND CustomerPassword=?";

  if (email != "" && password != "") {
    con.query(sql, [email, password], function (err, data, fields) {
      if (err) {
        res.send(JSON.stringify({ success: false, message: err }));
      } else {
        if (data.length > 0) {
          const token = jwt.sign(
            { userName: email, role: "admin" },
            "thisisadminsecretmwehehe",
            { expiresIn: "24h" }
          );
          res.send(JSON.stringify({ success: true, user: data, token: token }));
        } else {
          res.send(
            JSON.stringify({ success: false, message: "wrong password" })
          );
        }
      }
    });
  } else {
    res.send(
      JSON.stringify({
        success: false,
        message: "Email and password required!",
      })
    );
  }
});

//UPDATE ACCOUNTS
router.route("/update-profile").post((req, res) => {
  //get body
  var name = req.body.name;
  var address = req.body.address;
  var customerEmail = req.body.customerEmail
  console.log(customerEmail);
  //create query
  var sqlQuery =
    `UPDATE mscustomer SET CustomerName = '${name}', CustomerAddress = '${address}' WHERE CustomerEmail LIKE '${customerEmail}'`;

  //call database to insert so add or include database
  // ???? pass params here
  con.query(
    sqlQuery,
    function (error, data, fields) {
      if (error) {
        // if error send response here
        res.send(JSON.stringify({ success: false, message: error }));
      } else {
        // if success send response here
        res.send(JSON.stringify({ success: true, message: "success" }));
      }
    }
  );
});

//GET SPECIFIC USER 
router.route('/get-user').post((req, res) => {
  const customerEmail = req.body.customerEmail;
  console.log(customerEmail)
  const query = `SELECT * FROM MsCustomer WHERE CustomerEmail LIKE '${customerEmail}'`;
  con.query(query, (err, result) => {
    if (err) {
      res.send((err.message = "ERROR: Product Not Found"));
    }
    res.send(result);
  });
});


//USER PRODUCT ACCESS
//GET ALL PRODUCT
router.get("/get-all-product", function (req, res, next) {
  const query = "SELECT * FROM MsProduct";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//GET SPECIFIC PRODUCT
router.get("/get-product", (req, res) => {
  const id = req.query.id;
  console.log(id);
  const query = `SELECT * FROM MsProduct WHERE ProductID LIKE '${id}'`;
  con.query(query, (err, result) => {
    if (err) {
      res.send((err.message = "ERROR: Product Not Found"));
    }
    res.send(result);
  });
});

//GET ALL USER CARTS
router.post("/allUserCart", (req, res) => {
  const customerEmail = req.body.customerEmail;
  const query = `SELECT *, (mp.ProductPrice * mc.CartAmount) AS TotalPrice, mp.ProductStock FROM mscartlist mc
  JOIN msproduct mp ON mp.ProductID LIKE mc.ProductID
  WHERE mc.CustomerEmail LIKE '${customerEmail}'`;
  
  con.query(query, (err, result) => {
    if (err) {
      res.send((err.message = "ERROR: Cart Not Found"));
    }
    res.send(result);
  });
});

//GET HIGHEST USER CART ID
router.route("/getCartHighestID").get((req, res, next) => {
  const query =
    "SELECT CartID FROM MsCartList ORDER BY CartID DESC LIMIT 0, 1";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//POST USER CARTS
router.post("/insert-new-user-carts", (req, res) => {
  const cartID = req.body.cartID;
  const userEmail = req.body.userEmail;
  const productID = req.body.productID;
  const cartAmount = req.body.cartAmount;
  const isSelected = req.body.isSelected;
  console.log(userEmail)
  console.log(cartID)
  var sqlQuery =
    "INSERT INTO MsCartList(CartID,ProductID,CustomerEmail,CartAmount,isSelected) VALUES (?,?,?,?,?)";

  con.query(
    sqlQuery,
    [cartID, productID, userEmail, cartAmount, isSelected],
    function (error, data, fields) {
      if (error) {
        // if error send response here
        res.send(JSON.stringify({ success: false, message: error }));
      } else {
        // if success send response here
        res.send(JSON.stringify({ success: true, message: "added new cart" }));
      }
    }
  );
});

//UPDATE USER CARTS
router.post("/update-new-user-cart", (req, res) => {
  const cartID = req.body.cartID;
  const customerEmail = req.body.customerEmail;
  const cartAmount = req.body.cartAmount;
  const isSelected = req.body.isSelected;

  var sqlQuery = `UPDATE MsCartList SET CartAmount = ${cartAmount}, isSelected = '${isSelected}' WHERE CartID = '${cartID}' AND CustomerEmail ='${customerEmail}'`;

  con.query(sqlQuery, function (error, data, fields) {
    if (error) {
      // if error send response here
      res.send(JSON.stringify({ success: false, message: error }));
    } else {
      // if success send response here
      res.send(JSON.stringify({ success: true, message: "added new cart" }));
    }
  });
});

//UPDATE PRODUCT STOCKS UPON BUYING
router.post("/update-product-stock", (req, res) => {
  const productID = req.body.productID;
  const cartAmount = req.body.cartAmount;

  var sqlQuery = `UPDATE MsProduct SET ProductStock = ProductStock - ${cartAmount} WHERE ProductID = '${productID}'`;

  con.query(sqlQuery, function (error, data, fields) {
    if (error) {
      // if error send response here
      res.send(JSON.stringify({ success: false, message: error }));
    } else {
      // if success send response here
      res.send(JSON.stringify({ success: true, message: "added new cart" }));
    }
  });
});

//DELETE USER CARTS
router.delete("/delete-user-cart", (req, res) => {
  const cartID = req.body.cartID;
  const customerEmail = req.body.customerEmail;

  var sqlQuery = `DELETE FROM MsCartList WHERE CartID = '${cartID}' AND CustomerEmail = '${customerEmail}'`;
  con.query(sqlQuery, function (error, data, fields) {
    if (error) {
      // if error send response here
      res.send(JSON.stringify({ success: false, message: error }));
    } else {
      // if success send response here
      res.send(JSON.stringify({ success: true, message: "deleted new cart" }));
    }
  });
});

//GET ALL USER HISTORY
router.post("/AllUserHistory", (req, res) => {
  const customerEmail = req.body.customerEmail;
  const query = `SELECT * FROM MsHistory mh 
  JOIN MsProduct mp ON mh.ProductID LIKE mp.ProductID
  WHERE CustomerEmail LIKE '${customerEmail}' ORDER BY mh.DatePurchased DESC`;
  con.query(query, (err, result) => {
    if (err) {
      res.send((err.message = "ERROR: History Not Found"));
    }
    res.send(result);
  });
});

//GET HIGHEST HISTORY ID
router.route("/getHistoryHighestID").get((req, res, next) => {
  const query =
    "SELECT HistoryID FROM MsHistory ORDER BY HistoryID DESC LIMIT 0, 1";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//POST USER HISTORY
router.post("/insert-new-user-history", (req, res) => {
  const HistoryID = req.body.historyID;
  const customerEmail = req.body.customerEmail;
  const productID = req.body.productID;
  const PurchasedAmount = req.body.historyAmount;
  const TotalPrice = req.body.totalPrice; 

  var sqlQuery =
    "INSERT INTO MsHistory(HistoryID,ProductID,CustomerEmail,PurchasedAmount,TotalPrice,DatePurchased) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP())";

  con.query(
    sqlQuery,
    [HistoryID, productID, customerEmail, PurchasedAmount, TotalPrice],
    function (error, data, fields) {
      if (error) {
        // if error send response here
        res.send(JSON.stringify({ success: false, message: error }));
      } else {
        // if success send response here
        res.send(JSON.stringify({ success: true, message: "added new cart" }));
      }
    }
  );
});

//DELETE USER HISTORY
router.delete("/delete-user-history", (req, res) => {
  const customerEmail = req.body.customerEmail;

  var sqlQuery = `DELETE FROM MsHistory WHERE CustomerEmail = '${customerEmail}'`;
  con.query(sqlQuery, function (error, data, fields) {
    if (error) {
      // if error send response here
      res.send(JSON.stringify({ success: false, message: error }));
    } else {
      // if success send response here
      res.send(JSON.stringify({ success: true, message: "deleted history" }));
    }
  });
});

//SUMMING ALL CART PRODUCTS
router.post("/SumAllCartPrice", (req, res) => {
  const customerEmail = req.body.customerEmail;
  const query = `SELECT SUM(mp.ProductPrice * mc.CartAmount) AS TotalPrice FROM mscartlist mc
  JOIN msproduct mp ON mp.ProductID LIKE mc.ProductID
  WHERE mc.CustomerEmail LIKE '${customerEmail}' AND mc.isSelected LIKE 'true'`;
  con.query(query, (err, result) => {
    if (err) {
      res.send((err.message = "ERROR: " + err.code));
    }
    res.send(result[0]);
  });
});

module.exports = router;
