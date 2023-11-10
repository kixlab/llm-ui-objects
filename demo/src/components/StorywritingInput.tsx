
import React from "react";
import styled from "styled-components";

import { ObjectsContext, CellTree, CellEditor } from "llm-ui-objects";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    height: 100%;
    width: 55%;
`;

const StorywritingInput = () => {
    const { cells } = React.useContext(ObjectsContext);

    const activePath = cells.filter((cell) => cell.isActive).map((cell) => cell.id);
    const hoveredPath = cells.filter((cell) => cell.isHovered).map((cell) => cell.id);

    return (
        <Container>
            <CellEditor
                cellIds={hoveredPath.length > 0 ? hoveredPath : activePath}
                style={{width: "50%", backgroundColor: "#fff"}}
                textColor={hoveredPath.length > 0 ? "#0066ff99" : undefined}
            />
            <CellTree
                cellWidth={96}
                cellHeight={28}
                style={{width: "50%", height: "100%"}}
            />
        </Container>
    )
}

export default StorywritingInput;