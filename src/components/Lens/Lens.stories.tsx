import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Lens from "./Lens";

const meta: Meta<typeof Lens> = {
  component: Lens,
  title: "tsook/Lens",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Lens>;

export const Primary: Story = (args) => (
  <Lens data-testId="Lens-id" {...args} />
);
Primary.args = {
    id: "Lens-id",
    type: "list",
    style: {
        "width": "600px",
        "height": "400px"
    },
    onGenerationClick: (text: string) => console.log(text)
};