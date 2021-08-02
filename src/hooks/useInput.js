import { useReducer, useCallback } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        [action.name]: action.value,
      };
    case "RESET":
      return Object.keys(state).reduce((acc, current) => {
        acc[current] = "";
        return acc;
      }, {});
    case "CREDIT_RESET":
      return { ...state, handleCredit: "" };
    default:
      return state;
  }
}

function useInputs(initialForm) {
  const [form, dispatch] = useReducer(reducer, initialForm);
  // change
  const onChange = useCallback(e => {
    const { name, value } = e.target;
    dispatch({ type: "CHANGE", name, value });
  }, []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const credit_reset = useCallback(
    () => dispatch({ type: "CREDIT_RESET" }),
    []
  );

  return [form, onChange, reset, credit_reset];
}

export default useInputs;
