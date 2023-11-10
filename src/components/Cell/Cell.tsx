import React from "react";
import styled from "styled-components";
import { CellProps } from "./Cell.types";
import { ObjectsContext } from "../../context/ObjectsContextProvider";

const CellContainer = styled.div<{ active: number, selected: number, hovered: number, tabDirection?: string}>`
    display: flex;
    border: solid 2px ${({ active, selected }) =>  selected ? "rgb(0, 194, 255)" : (active ? '#0066ff' : "#ddd")};
    border-${({ tabDirection }) => tabDirection ? tabDirection : "top"}-width: 12px;
    border-radius: 8px;
    flex: 1;
    cursor: pointer;
`;

const MinCellContainer = styled.div<{ active: number, hovered: number, selected: number}>`
    display: flex;
    border: solid 2px ${({ active, selected, hovered }) =>  selected ? "rgb(0, 194, 255)" : (active ? '#0066ff' : (hovered ? "#0066ff66" : "#aaa"))};
    background-color: ${({ active, selected, hovered }) =>  selected ? "rgb(0, 194, 255)" : (active ? '#0066ff' : (hovered ? "#0066ff22" : "#fff"))};
    color: ${({ active }) => active ? "#fff" : "#999"};
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const CellContent = styled.textarea`
    font-family: inherit;
    font-size: 14px;
    color: #555;
    resize: none;
    padding: 4px 8px;
    margin: 0;
    border: none;
    border-radius: 8px;
    flex: 1;

    &:focus {
        outline: none;
    }
`;

const Cell: React.FC<CellProps> = ({ 
    id,
    text,
    isActive,
    isMinimized,
    isSelected,
    isHovered,
    tabDirection,
    minimizedText,
    onClick,
    onMouseEnter,
    onMouseLeave,
    style
}) => {
    const { updateCell, toggleCell } = React.useContext(ObjectsContext);
    const [currText, setCurrText] = React.useState(text);

    // resize textarea to fit content
    React.useEffect(() => {
        const textarea = document.getElementById(id + '-textarea') as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight - 8 + "px";
        }
    }, [currText]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if(e.detail === 1) {
            if(isSelected) toggleCell(id, 'isSelected');
            if (onClick) onClick(e);
            else toggleCell(id, 'isActive');
        } else if(e.detail === 2) {
            toggleCell(id, 'isSelected');
        }
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(onMouseEnter) onMouseEnter(e);
        toggleCell(id, 'isHovered');
    }
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(onMouseLeave) onMouseLeave(e);
        toggleCell(id, 'isHovered');
    }

    if(!isMinimized) {
        return (
            <CellContainer
                id={id}
                className="llmuiobj-cell"
                data-testid={id}
                active={isActive ? 1 : 0}
                selected={isSelected ? 1 : 0}
                hovered={isHovered ? 1 : 0}
                tabDirection={tabDirection}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={style}
            >
                <CellContent
                    id={id + '-textarea'}
                    value={currText}
                    onChange={(e) => {
                        updateCell(id, e.target.value)
                        setCurrText(e.target.value)
                    }}
                />
            </CellContainer>
        )
    } else {
        return (
            <MinCellContainer
                id={id}
                className="llmuiobj-cell-min"
                data-testid={id}
                active={isActive ? 1 : 0}
                selected={isSelected ? 1 : 0}
                hovered={isHovered ? 1 : 0}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={style}
            >
                {minimizedText}
            </MinCellContainer>
        )
    }
}

export default Cell;