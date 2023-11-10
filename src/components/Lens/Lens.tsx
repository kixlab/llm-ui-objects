import React from "react";
import styled from "styled-components";
import { LensProps, GenerationProps } from "./Lens.types";

import { ObjectsContext } from "../../context/ObjectsContextProvider";

import ListLens from "./ListLens";
import SpaceLens from "./SpaceLens";
import PlotLens from "./PlotLens";
import RatingLens from "./RatingLens";

const LensContainer = styled.div`
    flex: 1;
`;

const Lens: React.FC<LensProps> = ({ 
    id,
    type,
    style,
    onGenerationClick,
    getGenerationMetadata
}) => {
    const { generations, lenses } = React.useContext(ObjectsContext);

    const currLens = lenses.find((lens) => lens.id === id);

    const groupedLensIds = lenses.map((lens) => currLens?.group === lens.group ? lens.id : null);
    const generationsData = generations.filter((generation) => {
        if(generation.lensId === null) return false;
        if(generation.lensId === id) return true;
        if(groupedLensIds.includes(generation.lensId)) return true;
        return false;
    });

    return (
        <LensContainer
            id={id}
            style={style}
            data-testid={id}
        >
            {type === "list" && (
                <ListLens 
                    generations={generationsData}
                    onGenerationClick={onGenerationClick}
                />
            )}
            {type === "space" && getGenerationMetadata && (
                <SpaceLens 
                    generations={generationsData}
                    onGenerationClick={onGenerationClick}
                    getPosition={getGenerationMetadata}
                />
            )}
            {type === "plot" && getGenerationMetadata && (
                <PlotLens 
                    generations={generationsData}
                    onGenerationClick={onGenerationClick}
                    getRatings={getGenerationMetadata}
                />
            )}
            {type === "rating" && getGenerationMetadata && (
                <RatingLens 
                    generations={generationsData}
                    onGenerationClick={onGenerationClick}
                    getRatings={getGenerationMetadata}
                />
            )}
        </LensContainer>
    )
}

export default Lens;