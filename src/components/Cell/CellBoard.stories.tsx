import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import CellBoard from "./CellBoard";
import { ObjectsContextProvider } from "../../context/ObjectsContextProvider";

const meta: Meta<typeof CellBoard> = {
  component: CellBoard,
  title: "tsook/CellBoard",
  argTypes: {},
};
export default meta;

//type of cell or cellboard
type Story = StoryObj<typeof CellBoard>;

const generateHandler = (input: string | string[], parameters: any) => {
    return Promise.resolve(input);
}

export const Primary: Story = (args) => (
    <ObjectsContextProvider generateHandler={generateHandler}>
        <CellBoard data-testId="CellBoard-id" {...args} />
    </ObjectsContextProvider>
);
Primary.args = {
    initialBoard: [
        ["Cell 1", "Cell 2", "Cell 3"],
        ["Cell 4", "Cell 5", "Cell 6"],
        ["Cell 7", "Cell 8"],
    ],
    maxRows: 5,
    maxColumns: 5,
    setEntryCell: (cellId: string | undefined) => { },
}