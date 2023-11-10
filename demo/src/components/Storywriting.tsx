import React from "react";
import styled from "styled-components";
import { ObjectsContextProvider, CellProps, GeneratorProps, ParameterProps, LensProps } from "llm-ui-objects";

import { generate } from "./Api"
import StorywritingInput from "./StorywritingInput";
import StorywritingOutput from "./StorywritingOutput";

const defaultCells: CellProps[] = [
    {
        id: "cell-0",
        text: "As soon as I entered the hall for the UIST conference, I noticed that something was missing. ",
        isActive: true,
        isMinimized: true,
        minimizedText: "UIST",
        parentCellId: null
    },
    {
        id: "cell-1",
        text: " A worried murmur spread through the crowd as we realized that the stage was indeed empty.",
        isActive: true,
        isMinimized: true,
        minimizedText: "murmur",
        parentCellId: "cell-0"
    },
    {
        id: "cell-2",
        text: " The usual buzz of excitement and chatter that filled the air was conspicuously absent.",
        isActive: false,
        isMinimized: true,
        minimizedText: "buzz",
        parentCellId: "cell-0"
    }
];

const defaultParameters: ParameterProps[] = [
    {
        id: "model",
        name: "Model",
        value: "gpt-3.5-turbo",
        type: "nominal",
        allowedValues: ["gpt-3.5-turbo", "gpt-4", "gpt-3.5-turbo-0301", "gpt-4-0314"],
        valueNicknames: {"gpt-3.5-turbo": "3.5", "gpt-4": "4", "gpt-3.5-turbo-0301": "3.5M", "gpt-4-0314": "4M"},
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
        nickname: "present",
        value: 0.0,
        type: "continuous",
        allowedValues: [0.0, 2.0],
        defaultValue: 0.0
    },
    {
        id: "frequency_penalty",
        name: "Frequency Penalty",
        nickname: "frequent",
        value: 0.0,
        type: "continuous",
        allowedValues: [0.0, 2.0],
        defaultValue: 0.0
    }
];

const defaultGenerators: GeneratorProps[] = [
    {
        id: "generator-0",
        parameters: JSON.parse(JSON.stringify(defaultParameters)),
        color: "#0088ff",
        size: "medium",
        isGenerating: false,
        isSelected: false,
        cellId: null,
        lensId: "lens-0"
    },
    {
        id: "generator-1",
        parameters: [
            {
                id: "model",
                name: "Model",
                value: "gpt-4",
                type: "nominal",
                allowedValues: ["gpt-3.5-turbo", "gpt-4", "gpt-3.5-turbo-0301", "gpt-4-0314"],
                valueNicknames: {"gpt-3.5-turbo": "3.5", "gpt-4": "4", "gpt-3.5-turbo-0301": "3.5M", "gpt-4-0314": "4M"},
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
                nickname: "present",
                value: 0.0,
                type: "continuous",
                allowedValues: [0.0, 2.0],
                defaultValue: 0.0
            },
            {
                id: "frequency_penalty",
                name: "Frequency Penalty",
                nickname: "frequent",
                value: 0.0,
                type: "continuous",
                allowedValues: [0.0, 2.0],
                defaultValue: 0.0
            }
        ],
        color: "#0088ff",
        size: "medium",
        isGenerating: false,
        isSelected: false,
        cellId: null,
        lensId: "lens-0"
    }
];

const defaultLens: LensProps[] = [
    {
        id: "lens-0",
        type: "list",
        group: 0
    }
];

const generateStory = (input: string | string[], parameters: any) => {
    const systemPrompt = "You are a creative writing assistant. You will be given a couple of sentences for a story, and you should generate a sentence that continues the story.";
    return generate(systemPrompt, input, parameters);
}

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

const Storywriting = ({display}: {display: boolean}) => {
    return (
        <ObjectsContextProvider 
            cells={defaultCells}
            generators={defaultGenerators}
            lenses={defaultLens}
            generateHandler={generateStory as (input: string | string[], parameters: any) => Promise<string | string[]>}
            minimizeHandler={(text: string) => {
                const words = text.split(" ").map((word) => word.replace(/[.,?\/#!$%\^&\*;:{}=\-_`~()]/g,""));
                const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);
                return longestWord;
            }}
        >
            <Container style={{display: display ? "flex" : "none"}}>
                <StorywritingInput/>
                <StorywritingOutput parameters={defaultParameters}/>
            </Container>
        </ObjectsContextProvider>
    )
}

export default Storywriting;