const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (token == process.env.ADMINTOKEN) {
        next()
    } else {
      res.status(401).json({ error: "Invalid Token" });
    }
  }
  if(!token) {
    res.status(401).json({ error: "Missing Token" });
  }
};

module.exports = { protect }