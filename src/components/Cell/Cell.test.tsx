import React from "react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import {render, screen, waitFor } from '@testing-library/react';

import Cell from "./Cell";

describe("Cells", () => {
    var mockCell = {
        id: "Cell-id",
        text: "Cell text",
        isActive: false,
        isMinimized: false,
        isSelected: false,
        parentCellId: null
    };

    test("renders Generator component", () => {
        render(<Cell {...mockCell} />);
        
        const textArea = screen.getByRole("textbox");
        userEvent.type(textArea, "Cell text");
        expect(textArea).toHaveValue("Cell text");
    });
});