import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Cell from "./Cell";

const meta: Meta<typeof Cell> = {
  component: Cell,
  title: "tsook/Cell",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Cell>;

export const Primary: Story = (args) => (
  <Cell data-testId="Cell-id" {...args} />
);
Primary.args = {
    id: "Cell-id",
    text: "Cell\ntext"
}

