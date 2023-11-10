import React from "react";
import styled from "styled-components";
import ReactQuill, { Quill } from "react-quill";
import { DeltaStatic, Sources } from "quill";

import { CellProps } from "./Cell.types";
import { ObjectsContext } from "../../context/ObjectsContextProvider";

const Container = styled.div<{ textColor?: string }>`
    ${({ textColor }) => textColor ? `& span { color: ${textColor} !important; }` : ""}
`;

interface CellEditorProps {
    cellIds: string[];
    style?: React.CSSProperties;
    textColor?: string;
}

let Inline = Quill.import('blots/inline');
class CellBlot extends Inline {
    static create(value: any) {
        let node = super.create(value);
        node.setAttribute('id', value.id);
        node.setAttribute('style', value.style);
        return node;
    }

    static value(node: any) {
        return {
            id: node.getAttribute('id'),
            style: node.getAttribute('style')
        };
    }

    format(name: any, value: any) {
        if (name === CellBlot.blotName && value) {
            this.domNode.setAttribute('id', value.id);
            this.domNode.setAttribute('style', value.style);
        } else {
            super.format(name, value);
        }
    }
}
CellBlot.blotName = 'cell';
CellBlot.tagName = 'span';
Quill.register('formats/cell', CellBlot);

const formats = [
    'bold', 'italic', 'strike', 'underline', 
    'color', 'background', 'font', 'code',
    'cell'
];

const CellEditor: React.FC<CellEditorProps> = ({ 
    cellIds,
    style,
    textColor
}) => {
    const quillRef = React.useRef<any | null>(null);
    const reactQuillRef = React.useRef<ReactQuill | null>(null);

    const { cells, updateCell, addCell, toggleCell } = React.useContext(ObjectsContext);
    const [value, setValue] = React.useState<string>("");

    const prevCellIds = React.useRef<string[]>(cellIds);
    const prevCells = React.useRef<CellProps[]>(cells);
    
    const attachQuillRefs = () => {
        if (typeof reactQuillRef.current?.getEditor !== 'function') return;
        const quill = reactQuillRef.current.getEditor();
        if (quill != null) quillRef.current = quill;
    }

    const getOrderedActiveCells = () => {
        var newActiveCells: CellProps[] = cellIds.map(cellId => {
            const cell = cells.find(cell => cell.id == cellId);
            return cell;
        }) as CellProps[];

        // reorder newActiveCells from parent to child
        const newActiveCellsOrdered: CellProps[] = [];
        var currParent = newActiveCells.find(cell => !cell.parentCellId);
        while(currParent) {
            newActiveCellsOrdered.push(currParent);
            currParent = newActiveCells.find(cell => cell.parentCellId == currParent?.id);
        }

        return newActiveCellsOrdered;
    }

    React.useEffect(() => {
        attachQuillRefs();
        initializeCells(getOrderedActiveCells());
    }, []);

    React.useEffect(() => {
        if(cellIds.length == prevCellIds.current.length && cellIds.every((value, index) => value == prevCellIds.current[index])) return;

        initializeCells(getOrderedActiveCells());

        prevCellIds.current = cellIds;
    }, [cellIds]);

    React.useEffect(() => {
        // check if any cell has been selected that was not previously selected
        const newSelectedCell = cells.find(cell => cell.isSelected);
        const prevSelectedCellId = prevCells.current.find(cell => cell.isSelected)?.id;
        const prevSelectedCell = cells.find(cell => cell.id == prevSelectedCellId);

        if(prevSelectedCell === newSelectedCell) return;

        var currIdx = 0;
        var prevIdx = -1;
        var newIdx = -1;
        const activeCells = getOrderedActiveCells();
        for(var i = 0; i < activeCells.length; i++) {
            if(activeCells[i].id == prevSelectedCellId) {
                prevIdx = currIdx;
            } else if(activeCells[i].id == newSelectedCell?.id) {
                newIdx = currIdx;
            }
            currIdx += activeCells[i].text.length;
        }

        if(prevSelectedCell) {
            // get selection in quill
            const length = prevSelectedCell.text.length;
            quillRef.current.formatText(prevIdx, length, 'background', false);
        }
        if(newSelectedCell) {
            // get selection in quill
            const length = newSelectedCell.text.length;
            quillRef.current.formatText(newIdx, length, 'background',  "#0088ff33");
        }
        
        prevCells.current = cells;
    }, [cells]);

    const initializeCells = (cells: (CellProps | undefined)[]) => {
        const contents = cells.map((cell, index) => {
            if(!cell) return;
            return {
                insert: cell.text, 
                attributes: {
                    cell: { id: cell.id, style: index % 2 == 0 ? "color:#333" : "color:#666" }
                }
            };
        });
        quillRef.current.setContents(contents);
    }

    const parseSpans = (value: string) => {
        const spans = value.split("</span>");
        const cells = spans.map(span => {
            const cell = span.split("<span")[1];
            if(!cell) return {};
            const id = cell.split("id=")[1].split(" ")[0].replace(/"/g, "");
            const text = cell.split(">")[1];
            return {id, text};
        });
        return cells;
    }

    const checkChangedCells = (prevValue: string, newValue: string) => {
        const prevCellText = parseSpans(prevValue) as {id: string, text: string}[];
        const newCellText = parseSpans(newValue) as {id: string, text: string}[];

        const updatedCells: {id: string, text: string}[] = [];
        const deletedCells: {id: string, text: string}[] = [];

        prevCellText.forEach(prevCell => {
            const newCell = newCellText.find(newCell => newCell.id == prevCell.id);
            if(!newCell) {
                deletedCells.push(prevCell as {id: string, text: string});
            } else if(newCell.text != prevCell.text) {
                updatedCells.push(newCell);
            }
        })

        updatedCells.forEach(cell => {
            updateCell(cell.id, cell.text);
        });
        deletedCells.forEach(cell => {
            updateCell(cell.id, "␡");
        });

        if(deletedCells.length > 0) {
            const activeCells = getOrderedActiveCells();
            const newCells = activeCells.map(cell => {
                if(deletedCells.find(deletedCell => deletedCell.id == cell.id)) {
                    return {...cell, text: "␡"};
                }
                const updatedCell = updatedCells.find(updatedCell => updatedCell.id == cell.id);
                if(updatedCell) {
                    return {...cell, text: updatedCell.text};
                }
                return cell;
            });
            initializeCells(newCells);
        } else {
            setValue(newValue);
        }
    }

    return (
        <Container 
            style={style}
            textColor={textColor}
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
        >
            <link rel="stylesheet" href="//cdn.quilljs.com/1.3.6/quill.snow.css"></link>
            <ReactQuill
                ref={reactQuillRef}
                theme={"snow"}
                value={value}
                onChange={(newValue: string, delta: DeltaStatic, source: Sources) => {
                    if(source != "user") {
                        setValue(newValue);
                        return;
                    }
                    checkChangedCells(value, newValue);
                }}
                onChangeSelection={(range: any, source: Sources, editor: any) => {
                    if(!range || range.length > 0) return;
                    if(range.index == 0) {
                        toggleCell(cells[0].id, 'isSelected');
                        return;
                    }
                    const [leaf] = quillRef.current.getLeaf(range.index);
                    if(!leaf) return;
                    const cellId = leaf.parent.domNode.getAttribute("id");
                    if(!cellId) return;
                    const cell = cells.find(cell => cell.id == cellId);
                    if(!cell || cell.isSelected) return;
                    toggleCell(cellId, 'isSelected');
                }}
                onKeyDown={(e: any) => {
                    if(e.key == "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        const activeCells = getOrderedActiveCells();
                        const parentId = activeCells[activeCells.length-1].id;
                        addCell(" ", {parentCellId: parentId, isActive: true});

                        setTimeout(() => {
                            const length = quillRef.current.getLength();
                            quillRef.current.setSelection(length, 0);
                        }, 10);
                    } else if(e.key == "Backspace" && (e.metaKey || e.ctrlKey)) {
                        e.stopPropagation();
                    }
                }}
                modules={{toolbar: false}}
                formats={formats}
            />
        </Container>
    )
}

export default CellEditor;