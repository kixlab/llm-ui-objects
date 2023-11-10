import React from "react";
import styled from "styled-components";
import Cell from "./Cell";
import { CellProps } from "./Cell.types";
import { ObjectsContext } from "../../context/ObjectsContextProvider";

const CellTreeContainer = styled.div<{ cellHeight: number }>`
    display: flex;
    flex-direction: column;
    gap: ${({cellHeight}) => cellHeight}px;
`;

const CellTreeRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
`;

interface TreeNode {
    cellId: string | null;
    children: TreeNode[];
}

interface CellTreeProps {
    cellWidth: number;
    cellHeight: number;
    style?: React.CSSProperties;
}

const CellTree: React.FC<CellTreeProps> = ({ 
    cellWidth,
    cellHeight,
    style
}) => {
    const { cells, toggleCell, linkCells } = React.useContext(ObjectsContext);
    const [ treeStructure, setTreeStructure ] = React.useState<TreeNode>({cellId: null, children: []});
    
    const [ connector, setConnector ] = React.useState<{x1: number, y1: number, id: string, x2: number, y2: number} | null>(null);

    const recurseTreeStructure = (cells: CellProps[], currParent: string | null) => {
        const childrenCells: CellProps[] = cells.filter((cell: CellProps) => cell.parentCellId === currParent);
        const children: TreeNode[] = [];
        childrenCells.forEach((childCell: CellProps) => {
            children.push({
                cellId: childCell.id,
                children: recurseTreeStructure(cells, childCell.id)
            });
        });
        return children;
    }

    const parseTreeStructure = (cells: CellProps[]) => {
        return {
            cellId: null,
            children: recurseTreeStructure(cells, null)
        }
    }

    React.useEffect(() => {
        setTreeStructure(parseTreeStructure(cells));
    }, [cells]);

    const getCurrPath = (cellId: string) => {
        const path: string[] = [];
        let currentCell = cells.find((cell: CellProps) => cell.id === cellId);
        while(currentCell) {
            path.push(currentCell.id);
            currentCell = cells.find((cell: CellProps) => cell.id === currentCell?.parentCellId);
        }
        path.reverse();
        return path;
    }

    const selectPath = (cellId: string) => {
        const path = getCurrPath(cellId);
        cells.forEach((cell: CellProps) => {
            if(path.includes(cell.id) && !cell.isActive) {
                toggleCell(cell.id, 'isActive');
            } else if(!path.includes(cell.id) && cell.isActive) {
                toggleCell(cell.id, 'isActive');
            }
        });
    }

    const onHoverPath = (cellId: string) => {
        const path = getCurrPath(cellId);
        cells.forEach((cell: CellProps) => {
            if(path.includes(cell.id) && !cell.isHovered) {
                toggleCell(cell.id, 'isHovered');
            } else if(!path.includes(cell.id) && cell.isHovered) {
                toggleCell(cell.id, 'isHovered');
            }
        });
    }

    const rows: any[] = [];
    const edges: any[] = [];
    var current: (TreeNode & {parentPos?: number})[] = treeStructure.children;
    var jointChildren: (TreeNode & {parentPos?: number})[] = [];

    var depth = 0;
    while(current.length > 0) {
        const row: any[] = [];
        for(let i = 0; i < current.length; i++) {
            const cell = cells.find((cell: CellProps) => cell.id === current[i].cellId);
            if(cell) {
                row.push(
                    <Cell
                        key={cell.id}
                        {...cell}
                        isMinimized={true}
                        onClick={(e: any) => {
                            e.stopPropagation(); 
                            selectPath(cell.id)
                        }}
                        style={{width: cellWidth+"px", height: cellHeight+"px"}}
                        onMouseEnter={() => onHoverPath(cell.id)}
                        onMouseLeave={() => onHoverPath("")}
                    />
                );
                jointChildren = jointChildren.concat(current[i].children.map((child: TreeNode) => ({...child, parentPos: i})));

                const parentPos = current[i].parentPos;
                if(parentPos !== undefined) {
                    const startPosition = {
                        x: parentPos*(8+cellWidth) + (cellWidth / 2),
                        y: 2*depth*cellHeight - cellHeight - 1
                    }
                    const endPosition = {
                        x: i*(cellWidth+8) + (cellWidth / 2),
                        y: (2 * depth * cellHeight) + 1
                    }
                    edges.push(
                        <path
                            key={cell.id}
                            // draw diagonal line from parent to child
                            d={`M ${startPosition.x} ${startPosition.y} L ${endPosition.x} ${endPosition.y}`}
                            stroke={cell.isActive ? "#0088ff" : "#cccccc"}
                            strokeWidth="2"
                            fill="none"
                        />
                    )
                }
            }
        }
        rows.push(row);
        current = jointChildren;
        jointChildren = [];
        depth++;
    }

    return (
        <div 
            id="llmuiobj-tree-container"
            style={{...style, position: "relative"}}
            onMouseDown={(e: any) => {
                if(!e.target.className.includes("llmuiobj-cell-min")) return;
                const rect = document.getElementById("llmuiobj-tree-container")?.getBoundingClientRect();
                if(!rect) return;
                const id = e.target.getAttribute("id");
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setConnector({x1: x, y1: y, id: id, x2: x, y2: y});
            }}
            onMouseMove={(e: any) => {
                if(!connector) return;
                const rect = document.getElementById("llmuiobj-tree-container")?.getBoundingClientRect();
                if(!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                setConnector({...connector, x2: x, y2: y});
            }}
            onMouseUp={(e: any) => {
                if(!connector) return;
                setConnector(null);
                if(!e.target.className.includes("llmuiobj-cell-min")) return;
                const id = e.target.getAttribute("id");
                const path = getCurrPath(id)

                if(path.includes(connector.id)) return;
                linkCells(connector.id, id);
                path.push(connector.id);
                cells.forEach((cell: CellProps) => {
                    if(path.includes(cell.id) && !cell.isActive) {
                        toggleCell(cell.id, 'isActive');
                    } else if(!path.includes(cell.id) && cell.isActive) {
                        toggleCell(cell.id, 'isActive');
                    }
                });
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
                {edges}
            </svg>
            <CellTreeContainer cellHeight={cellHeight}>
                {rows.map((row, i) => (
                    <CellTreeRow key={i}>
                        {row}
                    </CellTreeRow>
                ))}
            </CellTreeContainer>
        </div>
    )
}

export default CellTree;