import React from "react";

import { TextInputBasic } from "./TextInputBasic";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/TextInputBasic",
  component: TextInputBasic,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <TextInputBasic {...args} />;

export const Text = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Text.args = {
  type: "text",
  placeHolder: "텍스트를 입력해 주세요",
};

export const Number = Template.bind({});
Number.args = {
  type: "number",
  placeHolder: "숫자를 입력해 주세요",
};

export const Date = Template.bind({});
Date.args = {
  type: "date",
  placeHolder: "날짜를 입력해 주세요",
};
