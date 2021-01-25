import jwt from 'jsonwebtoken';
import uuid4 from 'uuid4';
import { envMapping } from '../../constants';

const generateToken = ({ token_variables, secret, customer_id, res }) => {
  jwt.sign(
    token_variables,
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '24h',
      issuer: customer_id,
      jwtid: uuid4(),
    },
    function (error, token) {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(200).json({ token });
      }
    }
  );
};

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  let payload;
  try {
    payload = JSON.parse(req.body);
  } catch (error) {
    res.status(400).json({ error });
    return;
  }

  var { room_id, user_name, peer_id, env, role } = payload;
  let user_id;
  if (user_name) {
    user_id = uuid4() + user_name;
  } else {
    user_id = uuid4() + peer_id; //To be deprecated. This peer_id is incorrectly named
  }
  if (env in envMapping) {
    const customer_id = process.env['CUSTOMER_ID'];
    const secret = process.env['APP_SECRET'];
    const access_key = process.env['APP_ACCESS_KEY'];
    const app_id = process.env['APP_ID'];
    const token_variables = {
      access_key: access_key,
      app_id: app_id,
      room_id: room_id,
      user_id: user_id,
      role: role,
    };

    generateToken({ token_variables, secret, customer_id, res });
  } else {
    const token = 'dummy';
    res.status(200).json({ token });
  }
};
