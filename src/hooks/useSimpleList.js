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
    default:
      return state;
  }
}

function useSimpleList(initialForm, f, p) {
  const [form, dispatch] = useReducer(reducer, initialForm);
  // change
  const onChange = useCallback(
    e => {
      const { name, value } = e.target;

      if (value <= 0) {
        dispatch({ type: "CHANGE", name, value: 0 });
        f(false);
        alert("숫자 혹은 1개 이상의 수량을 입력해주세요");
      } else if (
        Number(p.find(pro => pro.id === e.target.id).data.stock) < value
      ) {
        dispatch({ type: "CHANGE", name, value: 0 });
        f(false);
        alert(
          `${Number(
            p.find(pro => pro.id === e.target.id).data.stock
          )}개 이하를 입력해주세요`
        );
      } else {
        dispatch({ type: "CHANGE", name, value });
        f(true);
      }
    },
    [f, p]
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return [form, onChange, reset];
}

export default useSimpleList;
