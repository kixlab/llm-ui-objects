import React from "react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import {render, screen, waitFor } from '@testing-library/react';

import Generator from "./Generator";

describe("Generator", () => {
    var mockGenerator = {
        id: "Generator-id",
        parameters: [
            {
                id: "model",
                name: "Model",
                value: "gpt-3.5-turbo",
                type: "nominal",
                allowedValues: ["gpt-3.5-turbo", "gpt-4", "text-davinci-003"],
                valueNicknames: {"gpt-3.5-turbo": "3.5", "gpt-4": "4", "text-davinci-003": "D3"},
                defaultValue: "gpt-3.5-turbo"
            },
            {
                id: "temperature",
                name: "Temperature",
                nickname: "temp",
                value: 0.7,
                type: "continuous",
                allowedValues: [0.0, 2.0],
                defaultValue: 1.0
            },
            {
                id: "presence_penalty",
                name: "Presence Penalty",
                nickname: "presence",
                value: 0.0,
                type: "continuous",
                allowedValues: [0.0, 1.0],
                defaultValue: 0.0
            },
            {
                id: "top_k",
                name: "Top-K",
                nickname: "top",
                value: 3,
                type: "discrete",
                allowedValues: [1, 20],
                defaultValue: 0
            }
        ],
        color: "#0088ff",
        size: "large",
        isGenerating: false,
        isSelected: false,
        cellId: null,
        lensId: null
    };

    test("renders Generator component", () => {
        render(<Generator {...mockGenerator} />);
        expect(screen.getByTestId("Generator-id")).toBeInTheDocument();
        expect(screen.getByText("model")).toBeInTheDocument();
        expect(screen.getByText("temp")).toBeInTheDocument();
        expect(screen.getByText("presence")).toBeInTheDocument();
        expect(screen.getByText("top")).toBeInTheDocument();
        expect(screen.getByText("3.5")).toBeInTheDocument();
        expect(screen.getByText("0.7")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    test("renders Generator component with isGenerating", () => {
        render(<Generator {...mockGenerator} isGenerating={true} />);
        const svg = screen.getByTestId("Generator-id").querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
    
    test("renders parameter control panel", async () => {
        render(<Generator {...mockGenerator} />);
        const presence = screen.getByText("presence");
        expect(presence).toBeInTheDocument();
        const presenceParent = presence.parentElement as HTMLElement;
        userEvent.click(presenceParent);
        await waitFor(() => {
            expect(screen.getByText("Presence Pen")).toBeInTheDocument();
        });
    });
});