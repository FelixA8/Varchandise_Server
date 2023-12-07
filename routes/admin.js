var express = require("express");
var router = express.Router();


var con = require("./database");
const { protect } = require("../middleware/auth_middleware");

//ADMIN LOGIN
router.route('/login').post((req,res)=>{

  var email= req.body.email;
  var password= req.body.password;
  
  if(email === "admin" && password === "admin"){
    token = process.env.ADMINTOKEN;
    console.log(token);
    res.send(JSON.stringify({success:true, message:token}));
  }else{
      res.send(JSON.stringify({success:false,message:'Email and password required!'}));
  }
});

//GET ALL PRODUCT
router.get("/", protect, function (req, res, next) {
  const query = "SELECT * FROM MsProduct";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//GET SPECIFIC PRODUCT
router.post("/get-product", protect, (req, res) => {
  const id = req.body.id;
  const query = `SELECT * FROM MsProduct WHERE ProductID = '${id}'`;
  con.query(query, (err, result) => {
    if (err) {
        res.send(err.message = "ERROR: Product Not Found");
    };
    res.send(result);
  });
});

//GET HIGHEST USER CART ID
router.route("/getProductHighestID", protect).get((req, res, next) => {
  const query =
    "SELECT ProductID FROM MsProduct ORDER BY ProductID DESC LIMIT 0, 1";
  con.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//POST INSERT PRODUCT
router.post("/insert-new-product", protect, (req, res) => {
  const data = req.body;

  const query = `INSERT INTO MsProduct (ProductID, ProductName, ProductDescription, ProductCategory, ProductStock, ProductImage, ProductSeller, ProductPrice) VALUES
  ('${data.id}', '${data.name}', '${data.description}', '${data.category}', ${data.stock}, '${data.image}', '${data.seller}', ${data.price})`;
  con.query(query, (err, result) => {
    if (err) {
        throw err;
    };
    res.send(result);
  });
});

//PUT UPDATE GAME
router.post("/update-product", protect, (req, res) => {
  const data = req.body;
  const query = `UPDATE MsProduct SET ProductName = '${data.name}', ProductDescription = '${data.description}', ProductCategory = '${data.category}'
  , ProductStock = ${data.stock}, ProductImage = '${data.image}', ProductPrice = ${data.price}, ProductSeller = '${data.seller}' WHERE ProductID = '${data.id}'`;
  con.query(query, (err, result) => {
    if (err) {
        res.send(err);
    };
    res.status(200).json(result);
  });
});

//DELETE PRODUCT
router.delete("/delete-product", protect, (req, res) => {
  const id = req.body.id;
  const query = `DELETE FROM MsProduct WHERE ProductID LIKE '${id}'`;
  con.query(query, (err, result) => {
    if (err) {
        res.send(err);
    };
    res.send(result)
  });
});

module.exports = router;
