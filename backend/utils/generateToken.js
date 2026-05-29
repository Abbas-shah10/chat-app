import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const generateTokens = (id) => ({
  accessToken: generateAccessToken(id),
  refreshToken: generateRefreshToken(id),
});

export { generateAccessToken, generateRefreshToken, generateTokens };
export default generateAccessToken;
