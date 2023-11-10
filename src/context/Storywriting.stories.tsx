import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { ObjectsContextProvider, ObjectsContext, IObjectsContext } from "./ObjectsContextProvider";

import CellTree from "../components/Cell/CellTree";
import CellEditor from "../components/Cell/CellEditor";

import Generator from "../components/Generator/Generator";
import { GeneratorProps } from "../components/Generator/Generator.types";

import ListLens from "../components/Lens/ListLens";
import SpaceLens from "../components/Lens/SpaceLens";
import { LensProps, GenerationProps } from "../components/Lens/Lens.types";

const meta: Meta<typeof ObjectsContextProvider> = {
  component: ObjectsContextProvider,
  title: "tsook/Storywriting",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ObjectsContextProvider>;

const ChildComponent = () => {
    const { cells, generators, lenses } = React.useContext<IObjectsContext>(ObjectsContext);

    const activePath = cells.filter((cell) => cell.isActive).map((cell) => cell.id);
    const hoveredPath = cells.filter((cell) => cell.isHovered).map((cell) => cell.id);

    return (
        <div style={{display: "flex", flexDirection: "row", gap: "8px"}}>
            <CellEditor
                cellIds={hoveredPath.length > 0 ? hoveredPath : activePath}
                style={{width: "50%", height: "100%"}}
                textColor={hoveredPath.length > 0 ? "#0066ff99" : undefined}
            />
            <CellTree
                cellWidth={108}
                cellHeight={28}
                style={{width: "50%", height: "100%"}}
            />
        </div>
    )
}

const CellArgs = [
    {
        id: "0",
        text: "Start of the story.",
        isActive: true,
        minimizedText: "start",
        parentCellId: null
    },
    {
        id: "1",
        text: "Second sentence of the story.",
        isActive: true,
        minimizedText: "second",
        parentCellId: "0"
    },
    {
        id: "2",
        text: "Alternative second sentence of the story.",
        isActive: false,
        minimizedText: "alternative",
        parentCellId: "0"
    },
    {
        id: "3",
        text: "Third sentence of the story.",
        isActive: true,
        minimizedText: "third",
        parentCellId: "1"
    }
];

const DefaultParameters = [
    {
        id: "model",
        name: "Model",
        value: "gpt-3.5-turbo",
        type: "nominal",
        allowedValues: ["gpt-3.5-turbo", "gpt-4", "text-davinci-003"],
        valueNicknames: {"gpt-3.5-turbo": "3.5", "gpt-4": "4", "text-davinci-003": "D3"},
        defaultValue: "gpt-3.5-turbo"
    },
    {
        id: "temperature",
        name: "Temperature",
        nickname: "temp",
        value: 0.7,
        type: "continuous",
        allowedValues: [0.0, 2.0],
        defaultValue: 1.0
    },
    {
        id: "presence_penalty",
        name: "Presence Penalty",
        nickname: "presence",
        value: 0.0,
        type: "continuous",
        allowedValues: [0.0, 1.0],
        defaultValue: 0.0
    },
    {
        id: "top_k",
        name: "Top-K",
        nickname: "top",
        value: 3,
        type: "discrete",
        allowedValues: [1, 20],
        defaultValue: 0
    }
];
const GeneratorArgs = [
    {
        id: "generator-0",
        parameters: JSON.parse(JSON.stringify(DefaultParameters)),
        color: "#0066ff",
        cellId: null,
        lensId: null
    }
];

const LensArgs = [
    {
        id: "Lens-id",
        type: "list",
        generationIds: [],
        style: { 
            "width": "600px", 
            "height": "400px",
            "border": "solid 2px #0088ff",
            "borderRadius": "8px",
            "boxShadow": "0px 4px 4px 2px rgba(0, 0, 0, 0.2)",
            "padding": "8px"
        },
        group: 0
    }
];

export const Primary: Story = (args) => (
  <ObjectsContextProvider data-testId="ContextProvider-id" {...args} />
);
Primary.args = {
    children: <ChildComponent />,
    cells: CellArgs,
    generators: GeneratorArgs,
    lenses: LensArgs,
    generateHandler: (input: string | string[], parameters: any) => {
        // wait 3 seconds
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(input);
            }, 3000);
        });
    },
    minimizeHandler: (text: string) => {
        const words = text.split(" ").map((word) => word.replace(/[.,?\/#!$%\^&\*;:{}=\-_`~()]/g,""));
        const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);
        return longestWord;
    }
};