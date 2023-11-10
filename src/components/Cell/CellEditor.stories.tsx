import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import CellEditor from "./CellEditor";
import { ObjectsContextProvider } from "../../context/ObjectsContextProvider";

const meta: Meta<typeof CellEditor> = {
  component: CellEditor,
  title: "tsook/CellEditor",
  argTypes: {},
};
export default meta;

//type of cell or cellboard
type Story = StoryObj<typeof CellEditor>;

const generateHandler = (input: string | string[], parameters: any) => {
    return Promise.resolve(input);
}

export const Primary: Story = (args) => (
    <ObjectsContextProvider 
        cells={[
            {id: "1", text: "Random text here", parentCellId: null, isActive: true, isMinimized: false, isSelected: false},
            {id: "2", text: "Lorem ipsum text", parentCellId: null, isActive: false, isMinimized: false, isSelected: false},
            {id: "3", text: "Random text Lorem ipsum here too", parentCellId: null, isActive: false, isMinimized: false, isSelected: false},
        ]}
        generateHandler={generateHandler}
    >
        <CellEditor data-testId="CellEditor-id" {...args} />
    </ObjectsContextProvider>
);
Primary.args = {
    cellIds: ["1", "2", "3"],
}