export const ROLES = {
  HOST: 'host',
  GUEST: 'guest',
  LIVE_RECORD: 'live-record',
  VIEWER: 'viewer',
};

export const ENVS = {
  QA: 'qa-in',
  PROD: 'prod-in',
  STAGING: 'staging-in',
  DEV3: 'dev3-in',
  LOCAL: 'localhost',
};

export const envMapping = {
  'staging-in': 'STAGING_IN',
  'qa-in': 'QA_IN',
  'dev3-in': 'QA_IN',
  'prod-in': 'PROD_IN',
  'localhost': 'LOCAL_IN',
};
