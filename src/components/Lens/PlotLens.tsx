import React from "react";
import styled from "styled-components";
import { GenerationProps } from "./Lens.types";
import { ParameterProps } from "../Generator/Generator.types";

import { ObjectsContext } from "../../context/ObjectsContextProvider";

const PlotLensContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    padding-right: 4px;
    width: 100%;
    height: 100%;
`;

const PlotContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Plot = styled.div`
    flex: 1;
    position: relative;
    border-left: solid 1px #ccc;
    border-bottom: solid 1px #ccc;
`;

const Dot = styled.div<{x: number, y: number, selected: boolean, viewed: boolean}>`
    position: absolute;
    top: ${({y}) => y}%;
    left: ${({x}) => x}%;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({viewed}) => viewed ? "#aaaaaa99" : "#0088ff99"};
    cursor: pointer;
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

const YAxis = styled.div`
    height: 100%;
    color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    & > span {
        transform: rotate(180deg);
        writing-mode: tb-rl;
    }
`;

const XAxis = styled.div`
    width: 100%;
    color: #aaa;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
`;

const SelectorContainer = styled.div`
    display: flex;
    gap: 4px;
    font-size: 12px;
    color: #999;
    width: 100%;

    & > select {
        flex: 1;
        font-size: 12px;
        border: solid 1px #cccccc;
        border-radius: 4px;
        box-sizing: border-box;
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

interface PlotLensProps {
    generations: GenerationProps[];
    onGenerationClick?: (generationText: string) => void;
    getRatings: (generations: GenerationProps[]) => Promise<{[rating: string]: number}[]>;
}

const PlotLens: React.FC<PlotLensProps> = ({
    generations,
    onGenerationClick,
    getRatings
}) => {
    const { hoveredId, setHoveredId, updateGenerationsData } = React.useContext(ObjectsContext);

    const [loadingCount, setLoadingCount] = React.useState(0);

    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [viewed, setViewed] = React.useState<string[]>([]);

    const [allDimensions, setAllDimensions] = React.useState<string[]>([]);
    const [dimensions, setDimensions] = React.useState<{x: string | null, y: string | null}>({x: null, y: null});

    const prevGenerations = React.useRef<GenerationProps[]>([]);

    React.useEffect(() => {
        if(generations.length === prevGenerations.current.length) return;

        const newGenerations = generations.filter((generation: GenerationProps) => {
            return !prevGenerations.current.find((prevGeneration: GenerationProps) => prevGeneration.id === generation.id);
        });

        if(newGenerations.length === 0) return;

        const unprocessedGenerations = newGenerations.filter((generation: GenerationProps) => {
            const { metadata } = generation;
            if(!metadata) return true;
            const { ratings } = metadata;
            return !ratings;
        });

        if(unprocessedGenerations.length === 0 && (dimensions.x == null || dimensions.y == null)) {
            const ratings = newGenerations[0].metadata.ratings;
            const ratingDimensions = Object.keys(ratings);
            setAllDimensions(ratingDimensions);
            setDimensions({x: ratingDimensions[0], y: ratingDimensions[1]});
            return;
        }
        
        setLoadingCount((prev) => prev + 1);
        getRatings(unprocessedGenerations).then((ratings: {[key: string]: number}[]) => {
            if(ratings.length === 0) {
                setLoadingCount((prev) => prev - 1);
                return;
            }

            const ratingDimensions = Object.keys(ratings[0]);
            
            updateGenerationsData(
                unprocessedGenerations.map((generation) => generation.id),
                ratings.map((ratings) => ({ratings}))
            );

            if(dimensions.x == null || dimensions.y == null) {
                setAllDimensions(ratingDimensions);
                setDimensions({x: ratingDimensions[0], y: ratingDimensions[1]});
            }

            setLoadingCount((prev) => prev - 1);
        });

        prevGenerations.current = generations;
    }, [generations]);

    const hoveredGeneration = generations.find((generation: GenerationProps) => generation.id === hoveredId);
    const selectedGeneration = generations.find((generation: GenerationProps) => generation.id === selectedId);

    return (
        <PlotLensContainer>
            <PlotContainer>
                <SelectorContainer>
                    <div>X</div>
                    <select value={dimensions.x ? dimensions.x : ""} onChange={(e) => setDimensions({...dimensions, x: e.target.value})}>
                        {allDimensions.map((dimension) => (
                            <option key={dimension} value={dimension}>{dimension}</option>
                        ))}
                    </select>
                    <div>Y</div>
                    <select value={dimensions.y ? dimensions.y : ""} onChange={(e) => setDimensions({...dimensions, y: e.target.value})}>
                        {allDimensions.map((dimension) => (
                            <option key={dimension} value={dimension}>{dimension}</option>
                        ))}
                    </select>
                </SelectorContainer>
                <div style={{display: "flex", flexDirection: "row", gap: "8px", flex: 1, position: 'relative'}}>
                    <YAxis><span>{dimensions.y ? dimensions.y : "y-axis"}</span></YAxis>
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
                    <Plot>
                        {generations.length == 0 && (
                            <div style={{display: "flex", paddingTop: "5%", justifyContent: "center", alignItems: "center", color: "#ccc"}}>
                                No generations yet...
                            </div>
                        )}
                        {generations.map((generation: GenerationProps, index: number) => {
                            const { metadata } = generation;
                            if(!metadata) return null;
                            const { ratings } = metadata;
                            if(!ratings) return null;

                            // normalize x and y
                            const noise = (index % 15) / 5;
                            const normalizedX = (dimensions.x == null) ? 8 : ratings[dimensions.x] * 84 + 8 + noise;
                            const normalizedY = (dimensions.y == null) ? 8 : ratings[dimensions.y] * 84 + 8 + noise;

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
                                    viewed={viewed.includes(generation.id)}
                                />
                            )
                        })}
                    </Plot>
                </div>
                <XAxis>{dimensions.x ? dimensions.x : "x-axis"}</XAxis>
            </PlotContainer>
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
        </PlotLensContainer>
    )
}

export default PlotLens;