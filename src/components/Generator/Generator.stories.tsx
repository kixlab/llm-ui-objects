import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Generator from "./Generator";

const meta: Meta<typeof Generator> = {
  component: Generator,
  title: "tsook/Generator",
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Generator>;

export const Primary: Story = (args) => (
  <Generator data-testId="Generator-id" {...args} />
);
Primary.args = {
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
};

export const Small: Story = (args) => (
    <Generator data-testId="small-id" {...args} />
);
Small.args = {
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
    size: "small",
    isGenerating: false
};

export const Medium: Story = (args) => (
    <Generator data-testId="medium-id" {...args} />
);
Medium.args = {
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
    size: "medium",
    isGenerating: false
};