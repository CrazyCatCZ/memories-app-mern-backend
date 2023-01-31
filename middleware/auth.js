import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization.split(" ")[1];
    const googleLogin = token.length > 500;

    let decodedData;

    // Verify token
    if (googleLogin) {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
      req.username = decodedData?.name;
    } else {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decodedData?.user.id;
      req.username = decodedData?.user.username;
    }
    next();
  } catch (err) {
    console.error("Something wrong with auth middleware");
    res.status(500).json({ message: "Server Error" });
  }
};
