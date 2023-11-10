import React from "react";
import styled from "styled-components";
import { GenerationProps } from "./Lens.types";
import { ParameterProps } from "../Generator/Generator.types";

import { ObjectsContext } from "../../context/ObjectsContextProvider";

const RatingLensContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
    padding-right: 4px;

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

const GenerationContainer = styled.div<{selected: boolean, hovered: boolean}>`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    background-color: ${(props) => props.selected ? "#0088ff44" : (props.hovered ? "#0088ff22" : "#fff")};
    cursor: pointer;
    border: solid 1px ${(props) => props.selected ? "#0088ff" : (props.hovered ? "#0088ff66" : "#ccc")};
`;

const GenerationText = styled.div`
    font-size: 12px;
    color: #333;
    border-radius: 4px;
    padding: 8px;
    background-color: #fff;
`;

const RatingContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
`;

const RatingLabel = styled.div`
    font-size: 12px;
    color: #fff;
    position: absolute;
    top: 2px;
    left: 8px;
`;

const ScoreLabel = styled.div`
    font-size: 12px;
    color: #fff;
    position: absolute;
    top: 2px;
    right: 8px;
`;

const Bar = styled.div`
    width: 100%;
    height: 20px;
    border-radius: 4px;
    background-color: #ccc;
    overflow: hidden;
    display: flex;
    flex-direction: row;
`;

const BarFilled = styled.div`
    height: 100%;
    background-color: #0088ff;
`;

const BarEmpty = styled.div`
    height: 100%;
    background-color: #aaa;
    flex: 1;
`;

const AnimationContainer = styled.svg`
    position: absolute;
    top: calc(50% - 24px);
    left: calc(50% - 24px);
    height: 48px;
    width: 48px;
    z-index: 2;
`;

interface RatingLensProps {
    generations: GenerationProps[];
    onGenerationClick?: (generationText: string) => void;
    getRatings: (generations: GenerationProps[]) => Promise<{[rating: string]: number}[]>;
}

const RatingLens: React.FC<RatingLensProps> = ({
    generations,
    onGenerationClick,
    getRatings
}) => {
    const { hoveredId, setHoveredId, updateGenerationsData } = React.useContext(ObjectsContext);

    const [loadingCount, setLoadingCount] = React.useState(0);

    const [selectedId, setSelectedId] = React.useState<string | null>(null);

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

        if(unprocessedGenerations.length === 0) return;
        
        setLoadingCount((prev) => prev + 1);
        getRatings(unprocessedGenerations).then((ratings: {[key: string]: number}[]) => {
            if(ratings.length === 0) {
                setLoadingCount((prev) => prev - 1);
                return;
            }
            updateGenerationsData(
                unprocessedGenerations.map((generation) => generation.id),
                ratings.map((ratings) => ({ratings}))
            );
            setLoadingCount((prev) => prev - 1);
        });

        prevGenerations.current = generations;
    }, [generations]);

    return (
        <RatingLensContainer>
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
            {generations.map((generation) => {
                const ratings = generation.metadata?.ratings;

                if(!ratings) return null;

                return (
                    <GenerationContainer 
                        selected={generation.id === selectedId} 
                        hovered={generation.id === hoveredId}
                        onClick={() => onGenerationClick ? onGenerationClick(generation.content) : null}
                        onMouseEnter={() => setHoveredId(generation.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {Object.keys(ratings).map((ratingName: string) => {
                            return (
                                <RatingContainer>
                                    <RatingLabel>{ratingName}</RatingLabel>
                                    <ScoreLabel>{(ratings[ratingName] * 100).toFixed(0)}%</ScoreLabel>
                                    <Bar>
                                        <BarFilled style={{width: `${ratings[ratingName] * 100}%`}} />
                                        <BarEmpty />
                                    </Bar>
                                </RatingContainer>
                            );
                        })}
                    </GenerationContainer>
                )
            })}
        </RatingLensContainer>
    )
}

export default RatingLens;