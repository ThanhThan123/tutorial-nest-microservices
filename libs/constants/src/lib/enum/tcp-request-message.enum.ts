enum INVOICE {
  CREATE = 'invoice.create',
  GET_ALL_BY_PAGE = 'invoice.get_all_by_page',
  GET_BY_INVOICE_ID = 'invoice.get_invoice_by_id',
  GET_BY_ID = 'invoice.get_by_id',
  UPDATE_BY_ID = 'invoice.update_by_id',
  DELETE_BY_ID = 'invoice.delete_by_id',
  SEND = 'invoice.send',
  UPDATE_INVOICE_PAID = 'invoice.update_invoice_paid',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_LIST = 'product.get_list',
  GET_LIST_INVOICE = 'product.get_list_invoice',
  GET_ONE_BY_SKU = 'product.get_one_by_sku',
  UPDATE_PRODUCT_BY_SKU = 'product.update_product_by_sku',
  DELETE_PRODUCT_BY_ID = 'product.delete_product_by_id',
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

enum PDF_GENERATOR {
  CREATE_INVOICE_PDF = 'pdf_generator.create_invoice_pdf',
}

enum MEDIA {
  UPLOAD_FILE = 'media.upload_file',
  DESTROY_FILE = 'media.destroy_file',
}
export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
  USER,
  KEYCLOAK,
  AUTHORIZER,
  PDF_GENERATOR,
  MEDIA,
};
