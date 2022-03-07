import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * 기본 텍스트 인풋
 */
export const TextInputBasic = ({ type, placeHolder, ...props }) => {
  const [text, setText] = useState("");
  const handleText = (e) => {
    setText(e.target.value);
  };
  return (
    <Input
      type={type}
      placeholder={placeHolder}
      //   className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      value={text}
      onChange={(e) => handleText(e)}
      {...props}
    />
  );
};

const Input = styled.input`
  padding: 5px;
`;

TextInputBasic.propTypes = {
  /**
   * How large should the button be?
   */
  type: PropTypes.oneOf(["text", "number", "date"]),

  placeHolder: PropTypes.string,
};

TextInputBasic.defaultProps = {
  type: "text",
  placeHolder: "텍스트를 입력해 주세요",
};
