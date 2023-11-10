import React from "react";
import styled from "styled-components";
import { GenerationProps } from "./Lens.types";
import { ParameterProps } from "../Generator/Generator.types";

import { ObjectsContext } from "../../context/ObjectsContextProvider";

const SpaceLensContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding-right: 4px;
    width: 100%;
    height: 100%;
`;

const Space = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
`;

const Dot = styled.div<{x: number, y: number, selected: boolean, viewed: boolean, hovered: boolean}>`
    position: absolute;
    top: ${({y}) => y}%;
    left: ${({x}) => x}%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({viewed}) => viewed ? "#aaaaaa99" : "#0088ff66"};
    cursor: pointer;
    ${({hovered}) => hovered && `
    width: 16px;
    height: 16px;
    margin-left: -4px;
    margin-top: -4px;
    background-color: #0088ffaa;
    `}
    ${({selected}) => selected && `
    width: 16px;
    height: 16px;
    margin-left: -4px;
    margin-top: -4px;
    background-color: #0088ff;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
    `}
    &:hover {
        width: 16px;
        height: 16px;
        margin-left: -4px;
        margin-top: -4px;
        background-color: #0088ff;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    height: 100%;
    width: 0;
`;

const InfoSection = styled.div`
    display: flex;
    padding: 8px;
    border-radius: 8px;
    font-size: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    gap: 4px;
    flex-direction: column;
    overflow-y: auto;
`;

const InfoContent = styled.div`
    font-size: 12px;
    overflow-y: auto;
    flex: 1;

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

const AnimationContainer = styled.svg`
    position: absolute;
    top: calc(50% - 24px);
    left: calc(50% - 24px);
    height: 48px;
    width: 48px;
    z-index: 2;
`;

const parametersToHtml = (properties: ParameterProps[]) => {
    return properties.map((property: ParameterProps) => {
        const { name, value } = property;
        return (
            <div key={name}>
                {name}: <span style={{fontWeight: "bold"}}>{value}</span>
            </div>
        )
    })
}

interface SpaceLensProps {
    generations: GenerationProps[];
    onGenerationClick?: (generationText: string) => void;
    getPosition: (generations: GenerationProps[]) => Promise<{x: number, y: number}[]>;
}

const SpaceLens: React.FC<SpaceLensProps> = ({
    generations,
    onGenerationClick,
    getPosition
}) => {
    const { hoveredId, setHoveredId, updateGenerationsData } = React.useContext(ObjectsContext);

    const prevGenerations = React.useRef<GenerationProps[]>([]);

    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [viewed, setViewed] = React.useState<string[]>([]);

    const [loadingCount, setLoadingCount] = React.useState<number>(0);

    React.useEffect(() => {
        if(generations.length === prevGenerations.current.length) return;

        const newGenerations = generations.filter((generation: GenerationProps) => {
            return !prevGenerations.current.find((prevGeneration: GenerationProps) => prevGeneration.id === generation.id);
        });

        if(newGenerations.length === 0) return;

        const unprocessedGenerations = newGenerations.filter((generation: GenerationProps) => {
            const { metadata } = generation;
            if(!metadata) return true;
            const { position } = metadata;
            return !position;
        });

        setLoadingCount((prev) => prev + 1);

        getPosition(unprocessedGenerations).then((positions: {x: number, y: number}[]) => {
            if(positions.length == 0) {
                setLoadingCount((prev) => prev - 1);
                return;
            }
            updateGenerationsData(
                unprocessedGenerations.map((generation) => generation.id),
                positions.map((position) => ({position}))
            );
            setLoadingCount((prev) => prev - 1);
        });

        prevGenerations.current = generations;
    }, [generations]);

    const hoveredGeneration = generations.find((generation: GenerationProps) => generation.id === hoveredId);
    const selectedGeneration = generations.find((generation: GenerationProps) => generation.id === selectedId);

    const range = {x: {min: null, max: null}, y: {min: null, max: null}};
    generations.forEach((generation: GenerationProps) => {
        const { metadata } = generation;
        if(!metadata) return;
        const { position } = metadata;
        if(!position) return;
        const { x, y } = position;
        if(range.x.min == null || x < range.x.min) range.x.min = x;
        if(range.x.max == null || x > range.x.max) range.x.max = x;
        if(range.y.min == null || y < range.y.min) range.y.min = y;
        if(range.y.max == null || y > range.y.max) range.y.max = y;
    });

    return (
        <SpaceLensContainer>
            <Space>
                {generations.length == 0 && (
                    <div style={{display: "flex", paddingTop: "5%", justifyContent: "center", alignItems: "center", color: "#ccc"}}>
                        No generations yet...
                    </div>
                )}
                {loadingCount > 0 && (
                    <AnimationContainer >
                        <g transform={`scale(0.84)`}>
                            <path
                                fill="#0088ff99"
                                d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z">
                                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.5s" repeatCount="indefinite" />
                            </path>
                        </g>
                    </AnimationContainer>
                )}
                {generations.map((generation: GenerationProps, index: number) => {
                    const { metadata } = generation;
                    if(!metadata) return null;
                    const { position } = metadata;
                    if(!position) return null;
                    const { x, y } = position;

                    // normalize x and y
                    const noise = (index % 15) / 5;
                    const normalizedX = (range.x.min == null || range.x.max == null) ? 8 : (x - range.x.min) / (range.x.max - range.x.min) * 84 + 8 + noise;
                    const normalizedY = (range.y.min == null || range.y.max == null) ? 8 : (y - range.y.min) / (range.y.max - range.y.min) * 84 + 8 + noise;

                    return (
                        <Dot 
                            key={generation.id}
                            x={normalizedX} y={normalizedY}
                            onClick={() => setSelectedId(generation.id)}
                            onMouseOver={() => {
                                setHoveredId(generation.id);
                                setViewed([...viewed, generation.id]);
                            }}
                            onMouseOut={() => setHoveredId(null)}
                            selected={selectedId === generation.id}
                            hovered={hoveredId === generation.id}
                            viewed={viewed.includes(generation.id)}
                        />
                    )
                })}
            </Space>
            <InfoContainer>
                <InfoSection style={{flex: 1}}>
                    <div><b>Input</b></div>
                    <InfoContent style={{color: hoveredGeneration ? "#0066ff99" : (selectedGeneration ? "#555" : "#999")}}>
                        {hoveredGeneration ? 
                            hoveredGeneration.inputText : 
                            (selectedGeneration ? selectedGeneration.inputText : "Hover over a generation")
                        }
                    </InfoContent>
                </InfoSection>
                <InfoSection style={{flex: 1}}>
                    <div><b>Parameters</b></div>
                    <InfoContent style={{color: hoveredGeneration ? "#0066ff99" : (selectedGeneration ? "#555" : "#999")}}>
                        {hoveredGeneration ? 
                            parametersToHtml(hoveredGeneration.parameters) : 
                            (selectedGeneration ? parametersToHtml(selectedGeneration.parameters) : "Hover over a generation")
                        }
                    </InfoContent>
                </InfoSection>
                <InfoSection 
                    style={{flex: 1, border: "solid 1px #0066ff", cursor: "pointer"}}
                    onClick={() => selectedGeneration && onGenerationClick && onGenerationClick(selectedGeneration.content)}
                >
                    <div><b>Output</b></div>
                    <InfoContent style={{color: hoveredGeneration ? "#0066ff99" : (selectedGeneration ? "#555" : "#999")}}>
                        {hoveredGeneration ?
                            hoveredGeneration.content :
                            (selectedGeneration ? selectedGeneration.content : "Hover over a generation")
                        }
                    </InfoContent>
                </InfoSection>
            </InfoContainer>
        </SpaceLensContainer>
    )
}

export default SpaceLens;