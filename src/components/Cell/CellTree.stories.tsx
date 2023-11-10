import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import CellTree from "./CellTree";
import { ObjectsContextProvider } from "../../context/ObjectsContextProvider";

const meta: Meta<typeof CellTree> = {
  component: CellTree,
  title: "tsook/CellTree",
  argTypes: {},
};
export default meta;

//type of cell or cellboard
type Story = StoryObj<typeof CellTree>;

const generateHandler = (input: string | string[], parameters: any) => {
    return Promise.resolve(input);
}

export const Primary: Story = (args) => (
    <ObjectsContextProvider 
        cells={[
            {id: "1", text: "This should be linked to nothing", parentCellId: null, isActive: false, isMinimized: false, isSelected: false, minimizedText: "1->None"},
            {id: "2", text: "this one linked to 1", parentCellId: "1", isActive: false, isMinimized: false, isSelected: false, minimizedText: "2->1"},
            {id: "3", text: "this one linked to 2", parentCellId: "2", isActive: false, isMinimized: false, isSelected: false, minimizedText: "3->2"},
            {id: "4", text: "This should be linked to 1", parentCellId: "1", isActive: false, isMinimized: false, isSelected: false, minimizedText: "4->1"},
            {id: "5", text: "This should be linked to 4", parentCellId: "4", isActive: false, isMinimized: false, isSelected: false, minimizedText: "5->4"},
            {id: "6", text: "This should be linked to nothing", parentCellId: null, isActive: false, isMinimized: false, isSelected: false, minimizedText: "6->None"},
            {id: "7", text: "This should be linked to 6", parentCellId: "6", isActive: false, isMinimized: false, isSelected: false, minimizedText: "7->6"},
            {id: "8", text: "This should be linked to 7", parentCellId: "7", isActive: false, isMinimized: false, isSelected: false, minimizedText: "8->7"},
            {id: "9", text: "This should be linked to 4", parentCellId: "4", isActive: false, isMinimized: false, isSelected: false, minimizedText: "9->4"},
        ]}
        generateHandler={generateHandler}
    >
        <CellTree data-testId="CellTree-id" {...args} />
    </ObjectsContextProvider>
);
Primary.args = {
    cellWidth: 108,
    cellHeight: 28
}