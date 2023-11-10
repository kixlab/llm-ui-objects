import React from "react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";
import {render, screen, waitFor } from '@testing-library/react';

import Generator from "../components/Generator/Generator";
import Lens from "../components/Lens/Lens";
import { ObjectsContextProvider, ObjectsContext, IObjectsContext } from "./ObjectsContextProvider";

describe("ObjectsContextProvider", () => {
    var mockContextProvider: {
        generators: any[];
        lenses: any[];
        generateHandler: (input: string | string[], parameters: any) => Promise<string | string[]>;
    } = {
        generators: [],
        lenses: [],
        generateHandler: async (input: string | string[], parameters: any) => {
            return "output";
        }
    };

    const MockChild = () => {
        const { generators, lenses } = React.useContext<IObjectsContext>(ObjectsContext);

        return (
            <div data-testid="ChildComponent">
                {generators.map((generator: any) => (
                    <Generator 
                        key={generator.id}
                        {...generator}
                    />
                ))}
                {lenses.map((lens: any) => (
                    <Lens 
                        key={lens.id}
                        {...lens}
                        onGenerationClick={(generation: string) => {}}
                    />
                ))}
            </div>
        );
    }

    test("renders ObjectsContextProvider component", () => {
        render(
            <ObjectsContextProvider {...mockContextProvider}>
                <MockChild/>
            </ObjectsContextProvider>
        );
        expect(screen.getByTestId("ChildComponent")).toBeInTheDocument();
    });

    mockContextProvider = {
        ...mockContextProvider,
        generators: [
            {
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
                isGenerating: false
            }
        ],
        lenses: [
            {
                id: "Lens-id",
                type: "list"
            }
        ]
    }

    test("renders ObjectsContextProvider component with generators", () => {
        render(
            <ObjectsContextProvider {...mockContextProvider}>
                <MockChild/>
            </ObjectsContextProvider>
        );
        expect(screen.getByText("Generate")).toBeInTheDocument();
    });
});