export interface GeneratorProps {
    id: string;
    parameters: ParameterProps[];
    color: string;
    size?: string;
    numColumns?: number;
    isGenerating?: boolean;
    isSelected?: boolean;
    cellId: string | null;
    lensId: string | null;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ParameterProps {
    id: string;
    name: string;
    nickname?: string;
    type: string;
    allowedValues: string[] | number[];
    valueNicknames?: {[key: string]: string};
    defaultValue: string | number;
    value?: string | number;
}