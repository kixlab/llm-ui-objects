import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { ObjectsContextProvider, ObjectsContext, IObjectsContext } from "./ObjectsContextProvider";

import Cell from "../components/Cell/Cell";
import Generator from "../components/Generator/Generator";
import Lens from "../components/Lens/Lens";
import { GeneratorProps } from "../components/Generator/Generator.types";
import { LensProps, GenerationProps } from "../components/Lens/Lens.types";

import getLoremIpsum from "../utils/getLoremIpsum";

const meta: Meta<typeof ObjectsContextProvider> = {
  component: ObjectsContextProvider,
  title: "tsook/ObjectsContextProvider",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof ObjectsContextProvider>;

const GeneratorArgs = [
    {
        id: "Generator-id",
        parameters: [
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
        ],
        color: "#0088ff",
        size: "large",
        isGenerating: false,
        isSelected: false,
        cellId: null,
        lensId: null
    },
    {
        id: "Generator2-id",
        parameters: [
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
        ],
        color: "#0088ff",
        size: "medium",
        isGenerating: false,
        isSelected: false,
        cellId: null,
        lensId: null
    },
    {
        id: "Generator3-id",
        parameters: [
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
        ],
        color: "#0088ff",
        size: "small",
        isGenerating: false,
        isSelected: false,
        cellId: null,
        lensId: null
    },
];

const LensArgs = [
    {
        id: "Lens-id",
        type: "rating",
        style: { 
            "width": "600px", 
            "height": "200px",
            "border": "solid 2px #0088ff",
            "borderRadius": "8px",
            "boxShadow": "0px 4px 4px 2px rgba(0, 0, 0, 0.2)",
            "padding": "8px"
        },
        group: 0,
        getGenerationMetadata: (generations: GenerationProps[]) => {
            var ratings: {creative: number, engaging: number, positive: number, concise: number, simple: number}[] = [];
            for(let i = 0; i < generations.length; i++) {
                const creative = Math.floor(Math.random()*5);
                const engaging = Math.floor(Math.random()*10);
                const positive = Math.floor(Math.random()*10);
                const concise = Math.floor(Math.random()*8);
                const simple = Math.floor(Math.random()*40);
                ratings.push({creative, engaging, positive, concise, simple});
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(ratings);
                }, 1000);
            }) as Promise<{[key: string]: number}[]>;
        }
    },
    {
        id: "Lens2-id",
        type: "space",
        style: { 
            "width": "600px", 
            "height": "200px",
            "border": "solid 2px #0088ff",
            "borderRadius": "8px",
            "boxShadow": "0px 4px 4px 2px rgba(0, 0, 0, 0.2)",
            "padding": "8px"
        },
        group: 0,
        getGenerationMetadata: (generations: GenerationProps[]) => {
            var positions: {x: number, y: number}[] = [];
            for(let i = 0; i < generations.length; i++) {
                const x = Math.random() - Math.random() * 3;
                const y = Math.random() + Math.random() * 5;
                positions.push({ x, y });
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(positions);
                }, 1000);
            }) as Promise<{x: number, y: number}[]>;
        }
    },
]

const ChildComponent = () => {
    const { 
        cells, 
        generators, 
        lenses, 
        addCell,
        linkCells,
        linkCellToGenerator,
        linkGeneratorToLens
    } = React.useContext<IObjectsContext>(ObjectsContext);

    React.useEffect(() => {
        for(let i = 0; i < generators.length; i++) {
            for(let j = 0; j < lenses.length; j++) {
                linkGeneratorToLens(generators[i].id, lenses[j].id);
            }
        }
    }, []);

    const handleClick = () => {
        const data = {
            isActive: false,
            isMinimized: false,
            isReadonly: false,
            isSelected: false,
            parentCellId: null
        }
        var newId = addCell("Lorem Ipsum", data);
        if(cells.length > 0) {
            linkCells(newId, cells[cells.length-1].id);
        }
        for (let i = 0; i < generators.length; i++) {
            linkCellToGenerator(newId, generators[i].id);
        }
    }

    const [ text, setText ] = React.useState<string>("");
    return (
        <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <div style={{display: "flex", flexDirection: "row", gap: "8px"}}>
                {cells.map((cell: any) => (
                    <Cell
                        key={cell.id}
                        {...cell}
                    />
                ))}
                <button onClick={handleClick}>Add</button>
            </div>
            <div style={{display: "flex", flexDirection: "row", gap: "8px"}}>
                {generators.map((generator: GeneratorProps) => (
                    <Generator 
                        key={generator.id}
                        {...generator}
                    />
                ))}
            </div>
            <div style={{display: "flex", flexDirection: "row", gap: "8px"}}>
                {lenses.map((lens: LensProps) => (
                    <Lens 
                        key={lens.id}
                        {...lens}
                        onGenerationClick={(generation: string) => setText(text + " " + generation)}
                    />
                ))}
            </div>
            <div style={{display: "flex", flexDirection: "row", gap: "8px"}}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} />
            </div>
        </div>
    );
}

const generateLoremIpsum = (input: string | string[]) => {
    const startText = typeof input === "string" ? input : input.join(" ");
    const numSentences = Math.floor(Math.random() * 5) + 1;
    const output = getLoremIpsum(numSentences);
    return startText + " " + output;
}

export const Primary: Story = (args) => (
  <ObjectsContextProvider data-testId="ContextProvider-id" {...args} />
);
Primary.args = {
    children: <ChildComponent />,
    cells: [],
    generators: GeneratorArgs,
    lenses: LensArgs,
    generateHandler: (input: string | string[], parameters: any) => {
        // wait 3 seconds
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(generateLoremIpsum(input));
            }, 3000);
        });
    }
};