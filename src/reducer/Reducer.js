export const initState = {
  notices: [],
  products: [],
  orders: [],
  userType: "before",
  user: null,
  category: "cd",
  orderCounts: null,
};

export function dataReducer(state, action) {
  switch (action.type) {
    case "NOTICES":
      return { ...state, notices: [...state.notices, { ...action.notice }] };
    case "PRODUCTS":
      return { ...state, products: [...state.products, { ...action.product }] };
    case "ORDERS":
      return { ...state, orders: [...state.orders, { ...action.order }] };
    case "USERTYPE":
      return { ...state, userType: action.userType };
    case "USER":
      return { ...state, user: action.user };
    case "CATEGORY":
      return { ...state, category: action.category };
    case "ORDER_COUNTS":
      return { ...state, orderCounts: action.orderCounts };
    default:
      return state;
  }
}
