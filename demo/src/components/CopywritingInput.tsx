import React from "react";
import styled from "styled-components";

import { ObjectsContext, CellBoard, Generator } from "llm-ui-objects";

const PlusSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
    width: 40%;
`;

const GeneratorTray = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > div:first-child {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: center;
        align-items: center;
    }

    & > div:last-child {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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

const CopywritingInput = ({parameters}: {parameters: any}) => {
    const [entryCell, setEntryCell] = React.useState<string | null>(null);
    const { generators, addGenerator, linkCellToGenerator } = React.useContext(ObjectsContext);

    React.useEffect(() => {
        if(!entryCell) return;
        generators.forEach((generator) => {
            if(generator.cellId === entryCell) return;
            linkCellToGenerator(entryCell, generator.id);
        });
    }, [entryCell]);

    const handleAddGenerator = () => {
        addGenerator({
            id: "placeholder",
            color: "#0088ff",
            size: "medium",
            parameters: JSON.parse(JSON.stringify(parameters)),
            cellId: entryCell,
            lensId: "lens-0"
        });
    }

    return (
        <Container>
            <CellBoard
                initialBoard={[
                    ["Product Name: The Smart Companion Shoes are a cutting-edge footwear solution designed to guide you to your destination with haptic feedback.", "Product: The QuantumPack 3.0 has a carbon-fiber exoskeleton for durability and a built-in quantum-charging power system to charges your devices instantly."],
                    ["Audience: Conference attendees", "Audience: travelers"],
                    ["Tone: Humorous", "Tone: Serious", "Tone: Informative"],
                    ["Keyword: futuristic", "Keyword: AI"]
                ]}
                maxRows={6}
                maxColumns={6}
                setEntryCell={(cellId: string | undefined) => setEntryCell(cellId || null)}
                style={{
                    width: "100%", 
                    flex: "1", 
                    backgroundColor: "#fff", 
                    padding: "32px 24px", 
                    borderRadius: "8px", 
                    boxSizing: "border-box",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                }}
            />
            <GeneratorTray>
                <div>
                    {generators.map((generator) => (
                        <Generator
                            key={generator.id}
                            {...generator}
                        />
                    ))}
                </div>
                <div>
                    <AddButton onClick={handleAddGenerator}>
                        {PlusSvg}
                    </AddButton>
                </div>
            </GeneratorTray>
        </Container>
    )
}

export default CopywritingInput;