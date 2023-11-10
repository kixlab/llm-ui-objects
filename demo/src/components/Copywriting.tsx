import React from "react";
import styled from "styled-components";
import { ObjectsContextProvider, CellProps, GeneratorProps, ParameterProps, LensProps } from "llm-ui-objects";

import { generate } from "./Api"
import CopywritingInput from "./CopywritingInput";
import CopywritingOutput from "./CopywritingOutput";

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
    }
];

const defaultLens: LensProps[] = [
    {
        id: "lens-0",
        type: "list",
        group: 0
    },
    {
        id: "lens-1",
        type: "rating",
        group: 0
    }
];

const generateAd = (input: string | string[], parameters: any) => {
    const systemPrompt = "You are a creative writing assistant. You will be given a couple of requirements for a creative advertisement, and you should create and advertisement that is at most 6 sentences long.";
    return generate(systemPrompt, input, parameters);
}

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 32px;
`;

const Copywriting = ({display}: {display: boolean}) => {
    return (
        <ObjectsContextProvider 
            generators={defaultGenerators}
            lenses={defaultLens}
            generateHandler={generateAd as (input: string | string[], parameters: any) => Promise<string | string[]>}
        >
            <Container style={{display: display ? "flex" : "none"}}>
                <CopywritingInput parameters={defaultParameters} />
                <CopywritingOutput />
            </Container>
        </ObjectsContextProvider>
    );
}

export default Copywriting;