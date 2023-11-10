import React from "react";
import { CellProps } from "../components/Cell/Cell.types";
import { GeneratorProps } from "../components/Generator/Generator.types";
import { LensProps, GenerationProps } from "../components/Lens/Lens.types";

interface Link {
    from: string;
    to: string;
}

export interface IObjectsContext {
    cells: CellProps[];
    addCell: (text: string, data?: any) => string;
    removeCell: (cellId: string) => void;
    updateCell: (cellId: string, text: string) => void;
    toggleCell: (cellId: string, property: string) => void;
    linkCells: (childId: string, parentId: string) => void;
    unlinkCell: (id: string) => void;

    generators: GeneratorProps[];
    addGenerator: (generator: GeneratorProps) => string;
    removeGenerator: (generatorId: string) => void;
    updateGenerator: (generatorId: string, parameters: any) => void;
    toggleGenerator: (generatorId: string, property: string) => void;
    onGenerate: (generatorId: string) => void;

    generations: GenerationProps[];
    updateGenerationsData: (ids: string[], data: any[]) => void;

    linkCellToGenerator: (cellId: string, generatorId: string) => void;
    unlinkCellFromGenerator: (generatorId: string) => void;
    linkGeneratorToLens: (generatorId: string, lensId: string) => void;
    unlinkGeneratorFromLens: (generatorId: string) => void;

    lenses: LensProps[];
    addLens: (lens: LensProps) => string;
    removeLens: (id: string) => void;
    changeLensType: (id: string, type: string) => void;
    linkLenses: (fromId: string, toId: string) => void;
    unlinkLens: (id: string) => void;
    resetLens: (id: string) => void;

    hoveredId: string | null;
    setHoveredId: (id: string | null) => void;
}

export const ObjectsContext = React.createContext<IObjectsContext>({
    cells: [],
    addCell: (text: string, data?: any) => { return "" },
    removeCell: (id: string) => {},
    updateCell: (id: string, text: string) => {},
    toggleCell: (id: string, property: string) => {},
    linkCells: (childId: string, parentId: string) => {},
    unlinkCell: (id: string) => {},

    generators: [],
    addGenerator: (generator: GeneratorProps) => { return "" },
    removeGenerator: (generatorId: string) => {},
    updateGenerator: (generatorId: string, parameters: any) => {},
    toggleGenerator: (generatorId: string, property: string) => {},
    onGenerate: (generatorId: string) => {},

    generations: [],
    updateGenerationsData: (ids: string[], data: any[]) => {},

    linkCellToGenerator: (cellId: string, generatorId: string) => {},
    unlinkCellFromGenerator: (generatorId: string) => {},
    linkGeneratorToLens: (generatorId: string, lensId: string) => {},
    unlinkGeneratorFromLens: (generatorId: string) => {},

    lenses: [],
    addLens: (lens: LensProps) => { return "" },
    removeLens: (id: string) => {},
    changeLensType: (id: string, type: string) => {},
    linkLenses: (fromId: string, toId: string) => {},
    unlinkLens: (id: string) => {},
    resetLens: (id: string) => {},

    hoveredId: null,
    setHoveredId: (id: string | null) => {}
});

interface Props {
    children: React.ReactElement | React.ReactElement[];
    cells?: CellProps[];
    generators?: GeneratorProps[];
    lenses?: LensProps[];
    generateHandler: (input: string | string[], parameters: any) => Promise<string | string[]>;
    minimizeHandler?: (text: string) => string;
}

const createRandomId = (type: string) => {
    return type + "-" + Math.random().toString(36).substring(7) + "-" + Date.now().toString(36).substring(7);
}

export const ObjectsContextProvider: React.FC<Props> = ({ 
    children, 
    cells,
    generators,
    lenses,
    generateHandler,
    minimizeHandler
}) => {
    // Cells Logic
    const [currCells, setCurrCells] = React.useState<CellProps[]>(cells || []);
    const addCell = (text: string, data?: any) => {
        const cell: CellProps = {
            id: createRandomId("cell"),
            text,
            isActive: false,
            isMinimized: false,
            isSelected: false,
            parentCellId: null,
            minimizedText: minimizeHandler ? minimizeHandler(text) : undefined,
            ...data
        };
        setCurrCells(currCells => [...currCells, cell]);
        return cell.id;
    }
    const removeCell = (id: string) => {
        setCurrCells(currCells => currCells.filter((cell) => cell.id !== id).map((cell) => {
            if(cell.parentCellId === id) {
                return { ...cell, parentCellId: null };
            }
            return cell;
        }));
    }
    const setCell = (id: string, property: string, value: any) => {
        setCurrCells(currCells => currCells.map((cell) => cell.id === id ? { ...cell, [property]: value } : cell));
    }
    const updateCell = (id: string, text: string) => {
        setCell(id, 'text', text);
        if(minimizeHandler) {
            setCell(id, 'minimizedText', minimizeHandler(text));
        }
    }
    const toggleCell = (id: string, property: string) => {
        const cell = currCells.find((cell) => cell.id === id);
        if(!cell) return "";
        if(property === "isMinimize") {
            if(cell.isMinimized) {
                setCurrCells(currCells => currCells.map((cell) => cell.id === id ? { ...cell, isMinimized: false } : cell));
            } else {
            if(cell.minimizedText !== undefined) return cell.minimizedText;
                const text = cell.text;
                var minimizedText = "";
                if(minimizeHandler) {
                    minimizedText = minimizeHandler(text);
                } else {
                    // find longest word
                    minimizedText = text.split(" ").reduce((acc, word) => {
                        return word.length > acc.length ? word : acc;
                    }, "");
                }
                setCurrCells(currCells => currCells.map((cell) => cell.id === id ? { ...cell, isMinimized: true, minimizedText } : cell));
            }
        } else if(property === "isSelected") {
            if(cell.isSelected) {
                setCell(id, 'isSelected', !cell.isSelected);
            } else {
                const selectedCell = currCells.find((cell) => cell.isSelected);
                setCurrCells(currCells => currCells.map((cell) => selectedCell && cell.id === selectedCell.id ? { ...cell, isSelected: false } : (cell.id === id ? { ...cell, isSelected: true } : cell)));
            }
        } else if(property === "isActive") {
            setCell(id, 'isActive', !cell.isActive);
        } else if(property === "isHovered")  {
            setCell(id, 'isHovered', !cell.isHovered);
        }
    }
    const linkCells = (childId: string, parentId: string) => {
        setCurrCells(currCells => currCells.map((cell) => cell.id === childId ? { ...cell, parentCellId: parentId } : cell));
    }
    const unlinkCell = (id: string) => {
        setCurrCells(currCells => currCells.map((cell) => cell.id === id ? { ...cell, parentCellId: null } : cell));
    }

    // Generators Logic
    const [currGenerators, setCurrGenerators] = React.useState<GeneratorProps[]>(generators || []);
    const [generations, setGenerations] = React.useState<GenerationProps[]>([]);
    const addGenerator = (generator: GeneratorProps) => {
        generator.id = createRandomId("generator");
        setCurrGenerators(currGenerators => [...currGenerators, generator]);
        return generator.id;
    };
    const removeGenerator = (id: string) => {
        setCurrGenerators(currGenerators => currGenerators.filter((generator) => generator.id !== id));
    };
    const setGenerator = (id: string, property: string, value: any) => {
        setCurrGenerators(currGenerators => currGenerators.map((generator) => generator.id === id ? { ...generator, [property]: value } : generator));
    };
    const updateGenerator = (id: string, parameters: any) => {
        setGenerator(id, 'parameters', parameters);
    }
    const toggleGenerator = (id: string, property: string) => {
        const generator = currGenerators.find((generator) => generator.id === id);
        if(!generator) return;
        if(property === "isSelected") {
            setGenerator(id, 'isSelected', !generator.isSelected);
        } else if(property === "isGenerating") {
            setGenerator(id, 'isGenerating', !generator.isGenerating);
        }
    }
    const getInput = (cellId: string | null, separator: string) => {
        var inputList: string[] = [];
        var currCellId = cellId;
        while(currCellId) {
            var cell = currCells.find((cell) => cell.id === currCellId);
            if(cell) {
                inputList.push(cell.text);
                currCellId = cell.parentCellId;
            } else {
                currCellId = null;
            }
        }
        return inputList.reverse().join(separator);
    }
    const onGenerate = (id: string, separator?: string) => {
        const generator = currGenerators.find((g) => g.id === id);
        if (!generator || generator.isGenerating) return;
        const { parameters } = generator;

        const input = getInput(generator.cellId, separator || " ");

        setGenerator(id, 'isGenerating', true);
        const formattedParameters = parameters.reduce((acc, parameter) => {
            return { ...acc, [parameter.id]: parameter.value };
        }, {});

        generateHandler(input, formattedParameters)
            .then((output) => {
                setGenerator(id, 'isGenerating', false);
                var outputs = typeof output === "string" ? [output] : output;
                const lensId = generator.lensId;
                const newGenerations = outputs.map((output) => ({
                    id: createRandomId("generation"),
                    generatorId: id,
                    lensId: lensId,
                    inputText: input,
                    content: output,
                    parameters: parameters,
                    metadata: null
                }));
                setGenerations(generations => [ ...generations, ...newGenerations ]);
            })
            .catch((error) => {
                setGenerator(id, 'isGenerating', false);
            });
    }
    const updateGenerationsData = (ids: string[], metadata: any[]) => {
        setGenerations(generations => generations.map((generation) => {
            const idx = ids.findIndex((id) => id === generation.id);
            if(idx != -1) {
                if(generation.metadata) {
                    return {
                        ...generation,
                        metadata: {
                            ...generation.metadata,
                            ...metadata[idx]
                        }
                    }
                } else {
                    return {
                        ...generation,
                        metadata: metadata[idx]
                    }
                }
            }
            return generation;
        }));
    }

    const linkCellToGenerator = (cellId: string, generatorId: string) => {
        setCurrGenerators(currGenerators => currGenerators.map((generator) => generator.id === generatorId ? { ...generator, cellId } : generator));
    }
    const unlinkCellFromGenerator = (generatorId: string) => {
        setCurrGenerators(currGenerators => currGenerators.map((generator) => generator.id === generatorId ? { ...generator, cellId: null } : generator));
    }
    const linkGeneratorToLens = (generatorId: string, lensId: string) => {
        setCurrGenerators(currGenerators => currGenerators.map((generator) => generator.id === generatorId ? { ...generator, lensId } : generator));
    }
    const unlinkGeneratorFromLens = (generatorId: string) => {
        setCurrGenerators(currGenerators => currGenerators.map((generator) => generator.id === generatorId ? { ...generator, lensId: null } : generator));
    }

    // Lenses Logic
    const [currLenses, setCurrLenses] = React.useState<LensProps[]>(lenses || []);
    const addLens = (lens: LensProps) => {
        lens.id = createRandomId("lens");
        const groupNumbers = currLenses.map((lens) => lens.group);
        const highestGroupNumber = Math.max(...groupNumbers);
        lens.group = highestGroupNumber + 1;
        setCurrLenses(currLenses => [...currLenses, lens]);
        return lens.id;
    }
    const removeLens = (id: string) => {
        setCurrLenses(currLenses => currLenses.filter((lens) => lens.id !== id));
        setCurrGenerators(currGenerators => currGenerators.map((generator) => {
            if(generator.lensId === id) {
                return { ...generator, lensId: null };
            }
            return generator;
        }));
    }
    const changeLensType = (id: string, type: string) => {
        setCurrLenses(currLenses => currLenses.map((lens) => lens.id === id ? { ...lens, type } : lens));
    }
    const linkLenses = (fromId: string, toId: string) => {
        // Check which has lowest group number then change all to same group number
        const fromLens = currLenses.find((lens) => lens.id === fromId);
        const toLens = currLenses.find((lens) => lens.id === toId);
        if(!fromLens || !toLens) return;
        const newGroupNumber = Math.min(fromLens.group, toLens.group);
        setCurrLenses(currLenses => currLenses.map((lens) => {
            if(lens.group === fromLens.group || lens.group === toLens.group) {
                return { ...lens, group: newGroupNumber };
            }
            return lens;
        }));
    }
    const unlinkLens = (id: string) => {
        const lens = currLenses.find((lens) => lens.id === id);
        if(!lens) return;
        // çreate new group number
        const groupNumbers = currLenses.map((lens) => lens.group);
        const newGroupNumber = Math.max(...groupNumbers) + 1;
        setCurrLenses(currLenses => currLenses.map((lens) => {
            if(lens.id === id) {
                return { ...lens, group: newGroupNumber };
            }
            return lens;
        }));
    }
    const resetLens = (id: string) => {
        const lens = currLenses.find((lens) => lens.id === id);
        if(!lens) return;

        // change all generations with this lensid to null
        setGenerations(generations => generations.map((generation) => {
            if(generation.lensId === id) {
                return { ...generation, lensId: null };
            }
            return generation;
        }));
    }

    const [hovered, setHovered] = React.useState<string | null>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: any) => {
            // find if any cell or generator is selected
            const cell = currCells.find((cell) => cell.isSelected);
            const generator = currGenerators.find((generator) => generator.isSelected);

            if(cell) {
                toggleCell(cell.id, 'isSelected');
            } else if(generator) {
                toggleGenerator(generator.id, 'isSelected');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        const handleKey = (event: any) => {
            if(!event.metaKey && !event.ctrlKey) return;

            const cell = currCells.find((cell) => cell.isSelected);
            const generator = currGenerators.find((generator) => generator.isSelected);
            const selected = cell?.id || generator?.id;

            if(!selected) return;

            if(event.key === "c") {
                if (currCells?.find((cell) => cell.id === selected)) {
                    const cell = currCells.find((cell) => cell.id === selected);
                    if(cell) {
                        const copy = JSON.parse(JSON.stringify(cell));
                        copy.id = createRandomId("cell");
                        copy.isSelected = false;
                        addCell(copy.text, copy);
                    }
                } else if(currGenerators?.find((generator) => generator.id === selected)) {
                    const generator = currGenerators.find((generator) => generator.id === selected);
                    if(generator) {
                        const copy = JSON.parse(JSON.stringify(generator));
                        copy.id = createRandomId("generator");
                        copy.isSelected = false;
                        addGenerator(copy);
                    }
                }
            } else if(event.key === "Backspace") {
                if (currCells?.find((cell) => cell.id === selected)) {
                    removeCell(selected);
                } else if(currGenerators?.find((generator) => generator.id === selected)) {
                    removeGenerator(selected);
                }
            }
        }
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKey);
        }
    }, [currCells, currGenerators]);

    return (
        <ObjectsContext.Provider 
            value={{ 
                cells: currCells,
                addCell,
                removeCell,
                updateCell,
                toggleCell,
                linkCells,
                unlinkCell,

                generators: currGenerators, 
                addGenerator, 
                removeGenerator, 
                updateGenerator,
                toggleGenerator,
                onGenerate,
                linkCellToGenerator,
                unlinkCellFromGenerator,
                linkGeneratorToLens,
                unlinkGeneratorFromLens,
                
                generations,
                updateGenerationsData,

                lenses: currLenses,
                addLens,
                removeLens,
                changeLensType,
                linkLenses,
                unlinkLens,
                resetLens,

                hoveredId: hovered,
                setHoveredId: setHovered
            }}
        >
            {children}
        </ObjectsContext.Provider>
    );
}
