export interface CellProps {
    id: string;
    text: string;
    isActive: boolean;
    isMinimized?: boolean;
    isSelected?: boolean;
    isHovered?: boolean;
    minimizedText?: string;
    tabDirection?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
    parentCellId: string | null;
    style?: React.CSSProperties;
}