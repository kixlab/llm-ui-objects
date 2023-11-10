import React from "react";
import styled from "styled-components";
import { ObjectsContext, ParameterProps, Generator, GeneratorProps, Lens } from "llm-ui-objects";

import { getPositions, getRatings } from "./Api";

const PlusSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>;
const ListSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>;
const SpaceSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M171.73,232.813A5.381,5.381,0,0,0,176.7,229.5,48.081,48.081,0,0,1,191.6,204.244c1.243-.828,1.657-2.484,1.657-4.141a4.22,4.22,0,0,0-2.071-3.312L74.429,128.473,148.958,85a9.941,9.941,0,0,0,4.968-8.281,9.108,9.108,0,0,0-4.968-8.281L126.6,55.6a9.748,9.748,0,0,0-9.523,0l-100.2,57.966a9.943,9.943,0,0,0-4.969,8.281V236.954a9.109,9.109,0,0,0,4.969,8.281L39.235,258.07a8.829,8.829,0,0,0,4.968,1.242,9.4,9.4,0,0,0,6.625-2.484,10.8,10.8,0,0,0,2.9-7.039V164.5L169.66,232.4A4.5,4.5,0,0,0,171.73,232.813ZM323.272,377.73a12.478,12.478,0,0,0-4.969,1.242l-74.528,43.062V287.882c0-2.9-2.9-5.8-6.211-4.555a53.036,53.036,0,0,1-28.984.414,4.86,4.86,0,0,0-6.21,4.555V421.619l-74.529-43.061a8.83,8.83,0,0,0-4.969-1.242,9.631,9.631,0,0,0-9.523,9.523v26.085a9.107,9.107,0,0,0,4.969,8.281l100.2,57.553A8.829,8.829,0,0,0,223.486,480a11.027,11.027,0,0,0,4.969-1.242l100.2-57.553a9.941,9.941,0,0,0,4.968-8.281V386.839C332.8,382.285,328.24,377.73,323.272,377.73ZM286.007,78a23,23,0,1,0-23-23A23,23,0,0,0,286.007,78Zm63.627-10.086a23,23,0,1,0,23,23A23,23,0,0,0,349.634,67.914ZM412.816,151.6a23,23,0,1,0-23-23A23,23,0,0,0,412.816,151.6Zm-63.182-9.2a23,23,0,1,0,23,23A23,23,0,0,0,349.634,142.4Zm-63.627,83.244a23,23,0,1,0-23-23A23,23,0,0,0,286.007,225.648Zm-62.074,36.358a23,23,0,1,0-23-23A23,23,0,0,0,223.933,262.006Zm188.883-82.358a23,23,0,1,0,23,23A23,23,0,0,0,412.816,179.648Zm0,72.272a23,23,0,1,0,23,23A23,23,0,0,0,412.816,251.92Z"/></svg>;
const PlotSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M.2 468.9C2.7 493.1 23.1 512 48 512l96 0 320 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-48c0-26.5-21.5-48-48-48L48 0C21.5 0 0 21.5 0 48L0 368l0 96c0 1.7 .1 3.3 .2 4.9z"/></svg>;
const TrashSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;
    flex: 1;
    position: relative;
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
`;

const GeneratorContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    user-select: none;
    justify-content: center;
`;

const LensContainer = styled.div`
    flex: 1;
    border: solid 2px #0088ff;
    border-radius: 8px;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.2);
    padding: 8px;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const LinkContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 136px;
    width: 32px;
    user-select: none;

    & > div {
        width: 100%;
        height: 4px;
        background-color: #0088ff99;
    }
`;

const AddButton = styled.div`
    align-items: center;
    background-color: #0066ff;
    fill: #fff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    height: 40px;
    width: 40px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);
`;

const LensButton = styled.div`
    height: 48px;
    width: 48px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: solid 2px #0088ff;
    fill: #0088ff;

    & > svg {
        height: 28px;
        width: 28px;
    }
`;

const LensStyle = {
    "width": "100%",
    "flex": "1 1 0",
    "overflow": "auto",
    "minHeight": "0px"
};

const LensHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > div:nth-child(2) {
        display: flex;
        flex-direction: row;
        gap: 4px;
    }
`;

const LensButtonMin = styled.div`
    height: 24px;
    width: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: solid 2px #0088ff;
    fill: #0088ff;

    & > svg {
        height: 16px;
        width: 16px;
    }
`;


const StorywritingOutput = ({ parameters }: {parameters: ParameterProps[]}) => {
    const { 
        cells, 
        addCell,
        generators, 
        addGenerator, 
        linkCellToGenerator, 
        lenses, 
        addLens,
        removeLens,
        linkGeneratorToLens,
        changeLensType,
        resetLens
    } = React.useContext(ObjectsContext);

    const [ connector, setConnector ] = React.useState<{x1: number, y1: number, x2: number, y2: number, id: string} | null>(null);
    const [ leafCell, setLeafCell ] = React.useState<string | null>(null);

    React.useEffect(() => {
        const activeCells = cells.filter((cell) => cell.isActive);
        const parentIds = activeCells.map((cell) => cell.parentCellId);
        const leafIds = activeCells.filter((cell) => !parentIds.includes(cell.id as string));
        if(leafIds.length === 0) return;
        const leafId = leafIds[0].id;

        generators.forEach((generator) => {
            if(generator.cellId === leafId) return;
            linkCellToGenerator(leafId, generator.id);
        });

        setLeafCell(leafId);
    }, [cells]);

    React.useEffect(() => {
        const lensWithNoGenerators = lenses.filter((lens) => {
            const linkedGenerators = generators.filter((generator) => generator.lensId === lens.id);
            return linkedGenerators.length === 0;
        });

        lensWithNoGenerators.forEach((lens) => {
            removeLens(lens.id);
        });
    }, [generators]);

    const handleGenerationClick = (generationText: string) => {
        addCell(
            " " + generationText,
            { parentCellId: leafCell }
        );
    }

    const handleAddGenerator = () => {
        addGenerator({
            id: "placeholder",
            color: "#0088ff",
            size: "medium",
            parameters: JSON.parse(JSON.stringify(parameters)),
            cellId: leafCell,
            lensId: null
        });
    }

    const handleAddLens = (generatorId: string, type: "list" | "space" | "plot") => {
        const lensId = addLens({
            id: "placeholder",
            type: type,
            group: -1,
            getGenerationMetadata: type === "space" ? getPositions : undefined
        });
        linkGeneratorToLens(generatorId, lensId);
    }

    const unlinkedGenerators = generators.filter((generator) => generator.lensId === null);
    const generatorIds = generators.map((generator) => generator.id);

    return (
        <Container
            id="storywriting-output-container"
            onMouseDown={(e: any) => {
                const targetId = e.target.getAttribute("id");
                const isGenerator = generatorIds.includes(targetId);
                if(!isGenerator) return;
                const rect = document.getElementById("storywriting-output-container")?.getBoundingClientRect();
                if(!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setConnector({x1: x, y1: y, x2: x, y2: y, id: targetId});
            }}
            onMouseMove={(e: any) => {
                if(!connector) return;
                const rect = document.getElementById("storywriting-output-container")?.getBoundingClientRect();
                if(!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setConnector({...connector, x2: x, y2: y});
            }}
            onMouseUp={(e: any) => {
                if(!connector) return;
                setConnector(null);

                var targetId: string | null = null;
                for(var i = 0; i < lenses.length; i++) {
                    const lens = lenses[i];
                    const lensDiv = document.getElementById(lens.id);
                    if(!lensDiv) return;
                    const rect = lensDiv.getBoundingClientRect();
                    if(e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
                        targetId = lens.id;
                        break;
                    }
                }

                if(!targetId) return;

                const linkedGenerators = generators.filter((generator) => generator.lensId === targetId);
                if(linkedGenerators.length === 2) return;
                linkGeneratorToLens(connector.id, targetId);

                const prevLinkedLens = generators.find((generator) => generator.id === connector.id)?.lensId;
                const alreadyLinkedGenerators = generators.filter((generator) => generator.lensId === prevLinkedLens);
                if(prevLinkedLens && alreadyLinkedGenerators.length === 1) removeLens(prevLinkedLens);
            }}
        >
            <svg width="100%" height="100%" style={{position: "absolute", top: 0, left: 0, zIndex: "-1"}}>
                {connector && (
                    <path
                        // draw diagonal line betwen connector
                        d={`M ${connector.x1} ${connector.y1} L ${connector.x2} ${connector.y2}`}
                        stroke="#0088ff33"
                        strokeWidth="4"
                        fill="none"
                    />
                )}
            </svg>
            {lenses.map((lens) => {
                const filteredGenerators = generators.filter((generator) => generator.lensId === lens.id);
                return (
                    <RowContainer key={lens.id}>
                        <GeneratorContainer>
                            {filteredGenerators.map((generator) => (
                                <Generator
                                    key={generator.id}
                                    {...generator}
                                />
                            ))}
                        </GeneratorContainer>
                        <LinkContainer>
                            <div></div>
                            {filteredGenerators.length === 2 && (<div></div>)}
                        </LinkContainer>
                        <LensContainer>
                            <LensHeader>
                                <div>
                                    <LensButtonMin onClick={() => resetLens(lens.id)}>
                                        {TrashSvg}
                                    </LensButtonMin>
                                </div>
                                <div>
                                    {["list", "space", "plot"].map((type) => (
                                        <LensButtonMin 
                                            onClick={() => changeLensType(lens.id, type)}
                                            style={lens.type !== type ? {borderColor: "#ccc", fill: "#ccc"} : {}}
                                        >
                                            {type === "list" ? ListSvg : (type === "space" ? SpaceSvg : PlotSvg)}
                                        </LensButtonMin>
                                    ))}
                                </div>
                            </LensHeader>
                            <Lens 
                                key={lens.id}
                                {...lens}
                                style={LensStyle}
                                onGenerationClick={handleGenerationClick}
                                getGenerationMetadata={lens.type === "space" ? getPositions : (lens.type === "plot" ? getRatings : undefined)}
                            />
                        </LensContainer>
                    </RowContainer>
                );
            })}
            {unlinkedGenerators.map((generator) => (
                <RowContainer>
                    <GeneratorContainer>
                        <Generator 
                            key={generator.id}
                            {...generator}
                        />
                    </GeneratorContainer>
                    <LinkContainer><div></div></LinkContainer>
                    <div style={{display: "flex", alignItems: "center", gap: "8px", flex: 1}}>
                        <LensButton onClick={() => handleAddLens(generator.id, "list")}>
                            {ListSvg}
                        </LensButton>
                        <LensButton onClick={() => handleAddLens(generator.id, "space")}>
                            {SpaceSvg}
                        </LensButton>
                        <LensButton onClick={() => handleAddLens(generator.id, "plot")}>
                            {PlotSvg}
                        </LensButton>
                    </div>
                </RowContainer>
            ))}
            {(lenses.length + unlinkedGenerators.length) < 3 && (
                <div style={{width: "130px", display: "flex", justifyContent: "center"}}>
                    <AddButton onClick={handleAddGenerator}>
                        {PlusSvg}
                    </AddButton>
                </div>
            )}
        </Container>
    )

    // return (
    //     <Container>
    //         <StorywritingGenerators 
    //             orderedGenerators={orderedGenerators.concat(unselectedGenerators)} 
    //             handleAddGenerator={handleAddGenerator} 
    //         />
    //         <StorywritingLenses unselected={unselectedGenerators.map((generator) => generator.id)}/>
    //     </Container>
    // )
}

export default StorywritingOutput;