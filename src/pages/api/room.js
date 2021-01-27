import axios from 'axios';
import jwt from 'jsonwebtoken';
import uuid4 from 'uuid4';
import { envMapping } from '../../constants';

function getJWT(payload, secret) {
  const issuer = process.env.CUSTOMER_ID;

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '24h',
    issuer: issuer,
    jwtid: uuid4(),
  });
}

function getManagementToken() {
  const accessKey = process.env.MANAGEMENT_KEY;
  const secret = process.env.MANAGEMENT_SECRET;
  const payload = { access_key: accessKey };

  return getJWT(payload, secret);
}

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
  let { room_name, recording_info, env } = payload;
  env = env || 'prod-in';
  let management_token = 'dummy';
  if (env in envMapping) {
    management_token = getManagementToken();
  }

  const options = {
    method: 'post',
    url: `https://${env}.100ms.live/api/v1/rooms`,
    data: {
      name: room_name,
      description: 'nk room',
      recording_info,
    },
    headers: {
      Authorization: `Bearer ${management_token}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    var resp = await axios(options);

    if (resp.status == 200) {
      res.status(200).json(resp.data);
    } else {
      res.status(resp.status).json(resp);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
