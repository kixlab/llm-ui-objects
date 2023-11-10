import React from "react";
import styled from "styled-components";
import { GenerationProps } from "./Lens.types";
import { ParameterProps } from "../Generator/Generator.types";

import { ObjectsContext } from "../../context/ObjectsContextProvider";

const InputIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 256 512">
        <path d="M.1 29.3C-1.4 47 11.7 62.4 29.3 63.9l8 .7C70.5 67.3 96 95 96 128.3V224H64c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v95.7c0 33.3-25.5 61-58.7 63.8l-8 .7C11.7 449.6-1.4 465 .1 482.7s16.9 30.7 34.5 29.2l8-.7c34.1-2.8 64.2-18.9 85.4-42.9c21.2 24 51.2 40.1 85.4 42.9l8 .7c17.6 1.5 33.1-11.6 34.5-29.2s-11.6-33.1-29.2-34.5l-8-.7C185.5 444.7 160 417 160 383.7V288h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H160V128.3c0-33.3 25.5-61 58.7-63.8l8-.7c17.6-1.5 30.7-16.9 29.2-34.5S239-1.4 221.3 .1l-8 .7C179.2 3.6 149.2 19.7 128 43.7c-21.2-24-51.2-40-85.4-42.9l-8-.7C17-1.4 1.6 11.7 .1 29.3z"/>
    </svg>
);

const ParameterIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
        <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
    </svg>
);

const ListLensContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
    max-height: 100%;

    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

const InfoButton = styled.div<{ opened: number }>`
    min-width: 24px;
    height: ${props => props.opened ? "inherit" : "24px"};
    border-radius: 4px;
    border: solid 2px ${props => props.opened ? "#0088ff" : "#cccccc"};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    fill: ${props => props.opened ? "#0088ff" : "#cccccc"};

    &:hover {
        border-color: #0088ffcc;
        fill: #0088ffcc;
    }
`;

const InfoContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 1;
    justify-content: center;
    border: solid 2px #0088ff66;
    border-radius: 4px;
    padding: 4px 8px;
    color: #555555;
    font-size: 14px;
    max-height: 200px;
    overflow-y: auto;
    word-break: break-word;
    white-space: pre-wrap;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 4px;
    }
`;

const Section = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 8px;
`;

const SectionTab = styled.div<{ minimized: number }>`
    width: ${props => props.minimized ? "28px" : "4px"};
    height: ${props => props.minimized ? "4px" : "inherit"};
    background-color: #dddddd;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background-color: #0088ffcc;
    }
`;

const SectionContent = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
`;


const OutputContainer = styled.div<{ viewed: number, hovered: number }>`
    border: solid 2px #cccccc;
    border-radius: 8px;
    padding: 4px 8px;
    color: #555555;
    cursor: pointer;
    font-size: 14px;
    font-weight: ${props => !props.viewed ? "bold" : "normal"};

    ${({hovered}) => hovered && `
        border-color: #0088ff;
        background-color: #0088ff22;
    `}
`;

const parametersToStr = (properties: ParameterProps[]) => {
    var str = "";
    for(var i = 0; i < properties.length; i++) {
        var prop = properties[i];
        str += prop.name + "=" + prop.value;
        if(i < properties.length - 1) {
            str += ";";
        }
    }
    return str;
}

const sectionGenerations = (generations: GenerationProps[]) => {
    const sections: {[key: string]: {[key: string]: {id: string, content: string}[]}} = {};
    for(var i = 0; i < generations.length; i++) {
        const generation = generations[i];
        const inputText = generation.inputText;
        const parametersStr = parametersToStr(generation.parameters);
        if(!(inputText in sections)) {
            sections[inputText] = {};
        }
        if(!(parametersStr in sections[inputText])) {
            sections[inputText][parametersStr] = [];
        }
        sections[inputText][parametersStr].push({
            id: generation.id,
            content: generation.content
        });
    }
    return sections;
}

interface ListLensProps {
    generations: GenerationProps[];
    onGenerationClick?: (generationText: string) => void;
}

const ListLens: React.FC<ListLensProps> = ({
    generations,
    onGenerationClick
}) => {
    const { hoveredId, setHoveredId } = React.useContext(ObjectsContext);

    const [viewed, setViewed] = React.useState<string[]>([]);
    const [minimized, setMinimized] = React.useState<string[]>([]);
    const [openInfo, setOpenInfo] = React.useState<string[]>([]);

    const sections = sectionGenerations(generations);

    return (
        <ListLensContainer>
            {generations.length === 0 && (
                <div style={{display: "flex", paddingTop: "5%", justifyContent: "center", alignItems: "center", height: "100%", color: "#ccc"}}>
                    No generations yet...
                </div>
            )}
            {Object.keys(sections).map((inputText, i) => ([
                <InfoContainer key={i+'-i'}>
                    <InfoButton
                        opened={openInfo.includes(`input-${i}`) ? 1 : 0}
                        onClick={() => {
                            const sectionId = `input-${i}`;
                            if(openInfo.includes(sectionId)) {
                                setOpenInfo(openInfo.filter(id => id !== sectionId));
                            } else {
                                setOpenInfo([...openInfo, sectionId]);
                            }
                        }}
                    >
                        {InputIcon}
                    </InfoButton>
                    {openInfo.includes(`input-${i}`) && (
                        <InfoContent>
                            {inputText}
                        </InfoContent>
                    )}
                </InfoContainer>,
                <Section key={i+'-s'}>
                    <SectionTab 
                        minimized={minimized.includes(`input-${i}`) ? 1 : 0}
                        onClick={() => {
                            const sectionId = `input-${i}`;
                            if(minimized.includes(sectionId)) {
                                setMinimized(minimized.filter(id => id !== sectionId));
                            } else {
                                setMinimized([...minimized, sectionId]);
                            }
                        }}
                    />
                    {!minimized.includes(`input-${i}`) && (
                        <SectionContent>
                            {Object.keys(sections[inputText]).map((parametersStr, j) => ([
                                <InfoContainer key={j+'-i'}>
                                    <InfoButton
                                        opened={openInfo.includes(`parameters-${i}-${j}`) ? 1 : 0}
                                        onClick={() => {
                                            const sectionId = `parameters-${i}-${j}`;
                                            if(openInfo.includes(sectionId)) {
                                                setOpenInfo(openInfo.filter(id => id !== sectionId));
                                            } else {
                                                setOpenInfo([...openInfo, sectionId]);
                                            }
                                        }}
                                    >
                                        {ParameterIcon}
                                    </InfoButton>
                                    {openInfo.includes(`parameters-${i}-${j}`) && (
                                        <InfoContent>
                                            {parametersStr.split(";").map((parameter, k) => {
                                                const [name, value] = parameter.split("=");
                                                return (
                                                    <div key={k}>
                                                        {name}: <b>{value}</b>
                                                    </div>
                                                )
                                            })}
                                        </InfoContent>
                                    )}
                                </InfoContainer>,
                                <Section key={j+'-s'}>
                                    <SectionTab 
                                        minimized={minimized.includes(`parameters-${i}-${j}`) ? 1 : 0}
                                        onClick={() => {
                                            const sectionId = `parameters-${i}-${j}`;
                                            if(minimized.includes(sectionId)) {
                                                setMinimized(minimized.filter(id => id !== sectionId));
                                            } else {
                                                setMinimized([...minimized, sectionId]);
                                            }
                                        }}
                                    />
                                    {!minimized.includes(`parameters-${i}-${j}`) && (
                                        <SectionContent>
                                            {sections[inputText][parametersStr].map((generation, k) => (
                                                <OutputContainer
                                                    key={k}
                                                    viewed={viewed.includes(generation.id) ? 1 : 0}
                                                    hovered={generation.id === hoveredId ? 1 : 0}
                                                    onMouseOver={() => {
                                                        if(!viewed.includes(generation.id)) {
                                                            setViewed([...viewed, generation.id]);
                                                        }
                                                        setHoveredId(generation.id);
                                                    }}
                                                    onMouseOut={() => {
                                                        setHoveredId(null);
                                                    }}
                                                    onClick={() => {
                                                        if(!onGenerationClick) return;
                                                        onGenerationClick(generation.content);
                                                    }}
                                                >
                                                    {generation.content}
                                                </OutputContainer>
                                            ))}
                                        </SectionContent>
                                    )}
                                </Section>
                            ]))}
                        </SectionContent>
                    )}
                </Section>
            ]))}
        </ListLensContainer>
    )
}

export default ListLens;