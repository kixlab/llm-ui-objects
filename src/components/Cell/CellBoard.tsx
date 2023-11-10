import React from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { CellProps } from "./Cell.types";
import { ObjectsContext } from "../../context/ObjectsContextProvider";

const CellBoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: 100%;
`;

const CellRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
`;

const CellsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    flex-grow: 1;
`;

const CellRowControls = styled.div`
    display: flex;
`;

const AddColumnButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    width: 32px;
    border-radius: 8px;
    background-color: #0088ff99;
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: #0088ff;
    }
    &:disabled {
        background-color: #dddddd;
        cursor: auto;   
    }
`;

const AddRowButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    width: 160px;
    border-radius: 8px;
    background-color: #0088ff99;
    color: #ffffff;
    font-size: 16px;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: #0088ff;
    }
    &:disabled {
        background-color: #dddddd;
        cursor: auto;   
    }
`;

interface CellBoardProps {
    initialBoard: string[][];
    maxRows: number;
    maxColumns: number;
    setEntryCell: (cellId: string | undefined) => void;
    style?: React.CSSProperties;
}

const CellBoard: React.FC<CellBoardProps> = ({
    initialBoard, 
    maxRows, 
    maxColumns, 
    setEntryCell,
    style
}) => {
    const [board, setBoard] = React.useState<string[][]>([]); // 2d array of cell ids
    const [activeCells, setActiveCells] = React.useState<(string | undefined)[]>([]); // array of cell ids or undefined for each row
    const { cells, addCell, linkCells, unlinkCell, toggleCell } = React.useContext(ObjectsContext);

    // initialize board
    React.useEffect(() => {
        var newBoard = initialBoard.map(row => row.map(text => {
            const newCellId = addCell(text);
            return newCellId;
        }));
        if(initialBoard.length == 0) {
            const newCellId = addCell("");
            newBoard = [[newCellId]];
        }
        setBoard(newBoard);
        setActiveCells(new Array(newBoard.length).fill(undefined));
    }, []);

    const handleActivateCell = (cell: CellProps, rowIndex: number) => {
        const newActiveCells = [...activeCells];
        if(cell.isActive) {
            const parentCellId = cell.parentCellId;
            const childCellId = activeCells[rowIndex + 1];
            if(parentCellId && childCellId) {
                linkCells(childCellId, parentCellId);
            } else if(childCellId) {
                unlinkCell(childCellId);
            }
            unlinkCell(cell.id);
            newActiveCells[rowIndex] = undefined;
        } else {
            // if a cell is already active in row, deactivate it
            const activeCellId = activeCells[rowIndex];
            if(activeCellId) {
                toggleCell(activeCellId, 'isActive');
                unlinkCell(activeCellId);
            }
            // link cell to parent
            const parentCellId = activeCells[rowIndex - 1];
            const childCellId = activeCells[rowIndex + 1];
            if(parentCellId) {
                linkCells(cell.id, parentCellId);
            }
            if(childCellId) {
                linkCells(childCellId, cell.id);
            }
            newActiveCells[rowIndex] = cell.id;
        }

        // find last activecell that is not undefined
        const inputCell = newActiveCells.reduceRight((acc, cur) => {
            if(acc) return acc;
            if(cur) return cur;
        });
        setEntryCell(inputCell);

        // activate or deactivate cell
        toggleCell(cell.id, 'isActive');  
        setActiveCells(newActiveCells);      
    }
    
    const addCellToRow = (rowIndex: number) => {
        const newCellId = addCell("");
        const newBoard = [...board];
        if(rowIndex === newBoard.length) {
            newBoard.push([]);
        }
        newBoard[rowIndex].push(newCellId);
        setBoard(newBoard);
    }

    return (
        <CellBoardContainer style={style}>
            {board.map((row, rowIndex) => (
                <CellRow key={rowIndex}>
                    <CellsContainer>
                        {row.map((cellId, columnIndex) => {
                            const cell = cells.find(cell => cell.id === cellId);
                            if (!cell) return null;
                            return (
                                <Cell
                                    key={cellId}
                                    {...cell}
                                    onClick={() => handleActivateCell(cell, rowIndex)}
                                />
                            );
                        })}
                    </CellsContainer>
                    <CellRowControls>
                        <AddColumnButton 
                            onClick={() => addCellToRow(rowIndex)}
                            disabled={row.length >= maxColumns}
                        >
                            +
                        </AddColumnButton>
                    </CellRowControls>
                </CellRow>
            ))}
            <CellRow>
                <AddRowButton 
                    onClick={() => addCellToRow(board.length)}
                    disabled={board.length >= maxRows}
                >
                    + New Row
                </AddRowButton>
            </CellRow>
        </CellBoardContainer>
    )
};

export default CellBoard;