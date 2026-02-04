enum INVOICE {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_LIST = 'product.get_list',
  GET_ONE_BY_SKU = 'product.get_one_by_sku',
  UPDATE_PRODUCT_BY_SKU = 'product.update_product_by_sku',
}
enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.get_all',
  GET_BY_USER_ID = 'user.get_by_user_id',
  DELETE_BY_USER_ID = 'user.delete_by_user_id',
  UPDATE_BY_USER_ID = 'user.update_by_user_id',
  FIND_USER_BY_USER_ID = 'user.find_user_by_user_id',
}

enum KEYCLOAK {
  CREATE_USER = 'keycloak.create_user',
}

enum AUTHORIZER {
  LOGIN = 'authorizer.login',
  VERIFY_USER_TOKEN = 'authorizer.verify_user_token',
}
export const TCP_REQUEST_MESSSAGE = {
  INVOICE,
  PRODUCT,
  USER,
  KEYCLOAK,
  AUTHORIZER,
};
