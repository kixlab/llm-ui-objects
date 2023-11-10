import React from "react";
import '@testing-library/jest-dom';
import {render, screen, waitFor } from '@testing-library/react';

import Lens from "./Lens";

describe("Lens", () => {
    var mockLens = {
        id: "Lens-id",
        type: "list",
        group: 0
    };

    test("renders List Lens component", () => {
        render(<Lens {...mockLens} />);
        expect(screen.getByTestId("Lens-id")).toBeInTheDocument();
    });

    // TODO: test case for clicking on a information button
});