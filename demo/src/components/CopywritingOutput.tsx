import React from "react";
import styled from "styled-components";

import { ObjectsContext, Lens } from "llm-ui-objects";

import { getPositions, getRatings } from "./Api";

const ListSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>;
const SpaceSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M171.73,232.813A5.381,5.381,0,0,0,176.7,229.5,48.081,48.081,0,0,1,191.6,204.244c1.243-.828,1.657-2.484,1.657-4.141a4.22,4.22,0,0,0-2.071-3.312L74.429,128.473,148.958,85a9.941,9.941,0,0,0,4.968-8.281,9.108,9.108,0,0,0-4.968-8.281L126.6,55.6a9.748,9.748,0,0,0-9.523,0l-100.2,57.966a9.943,9.943,0,0,0-4.969,8.281V236.954a9.109,9.109,0,0,0,4.969,8.281L39.235,258.07a8.829,8.829,0,0,0,4.968,1.242,9.4,9.4,0,0,0,6.625-2.484,10.8,10.8,0,0,0,2.9-7.039V164.5L169.66,232.4A4.5,4.5,0,0,0,171.73,232.813ZM323.272,377.73a12.478,12.478,0,0,0-4.969,1.242l-74.528,43.062V287.882c0-2.9-2.9-5.8-6.211-4.555a53.036,53.036,0,0,1-28.984.414,4.86,4.86,0,0,0-6.21,4.555V421.619l-74.529-43.061a8.83,8.83,0,0,0-4.969-1.242,9.631,9.631,0,0,0-9.523,9.523v26.085a9.107,9.107,0,0,0,4.969,8.281l100.2,57.553A8.829,8.829,0,0,0,223.486,480a11.027,11.027,0,0,0,4.969-1.242l100.2-57.553a9.941,9.941,0,0,0,4.968-8.281V386.839C332.8,382.285,328.24,377.73,323.272,377.73ZM286.007,78a23,23,0,1,0-23-23A23,23,0,0,0,286.007,78Zm63.627-10.086a23,23,0,1,0,23,23A23,23,0,0,0,349.634,67.914ZM412.816,151.6a23,23,0,1,0-23-23A23,23,0,0,0,412.816,151.6Zm-63.182-9.2a23,23,0,1,0,23,23A23,23,0,0,0,349.634,142.4Zm-63.627,83.244a23,23,0,1,0-23-23A23,23,0,0,0,286.007,225.648Zm-62.074,36.358a23,23,0,1,0-23-23A23,23,0,0,0,223.933,262.006Zm188.883-82.358a23,23,0,1,0,23,23A23,23,0,0,0,412.816,179.648Zm0,72.272a23,23,0,1,0,23,23A23,23,0,0,0,412.816,251.92Z"/></svg>;
const PlotSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M.2 468.9C2.7 493.1 23.1 512 48 512l96 0 320 0c26.5 0 48-21.5 48-48l0-96c0-26.5-21.5-48-48-48l-48 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-64 0 0 80c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-80-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-64-80 0c-8.8 0-16-7.2-16-16s7.2-16 16-16l80 0 0-48c0-26.5-21.5-48-48-48L48 0C21.5 0 0 21.5 0 48L0 368l0 96c0 1.7 .1 3.3 .2 4.9z"/></svg>;
const TrashSvg = <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    width: 58%;
`;

const TextareaContainer = styled.div`
    flex: 1;
    width: 100%;

    & > textarea {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        padding: 16px;
        resize: none;
        color: ${props => props.color};
        background-color: #fff;
        overflow-y: auto;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
        outline: none;
        font-family: "Roboto", sans-serif;
        box-sizing: border-box;
        transition: color 0.5s ease;
        
        &::-webkit-scrollbar {
            width: 4px;
        }
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 4px;
        }
    }
`;

const LensesContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
    flex: 1;
`;

const LensWrapper = styled.div`
    flex: 1;
    border: solid 2px #0088ff;
    border-radius: 8px;
    box-shadow: 0px 4px 4px 2px rgba(0, 0, 0, 0.2);
    padding: 8px;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const LensStyle = {
    "width": "100%",
    "flex": "1 1 0",
    "overflow": "auto",
    "minHeight": "0px"
};

const LensHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > div:nth-child(2) {
        display: flex;
        flex-direction: row;
        gap: 4px;
    }
`;

const LensButtonMin = styled.div`
    height: 24px;
    width: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: solid 2px #0088ff;
    fill: #0088ff;

    & > svg {
        height: 16px;
        width: 16px;
    }
`;


const CopywritingOuput = () => {
    const { lenses, resetLens, changeLensType } = React.useContext(ObjectsContext);

    const [text, setText] = React.useState<string>("");
    const [textColor, setTextColor] = React.useState<string>("#333333");


    // setTextColor("#0066ff");
    // setTimeout(() => {
    //     setTextColor("#333333");
    // }, 500);

    const handleGenerationClick = (generationText: string) => {
        setText(text + generationText);
        setTextColor("#0066ff");
        setTimeout(() => {
            setTextColor("#333333");
        }, 500);
    }

    return (
        <Container>
            <TextareaContainer>
                <textarea style={{color: textColor}} value={text} onChange={(e) => setText(e.target.value)} />
            </TextareaContainer>
            <LensesContainer>
                <LensWrapper style={{flex: 5}}>
                    <LensHeader>
                        <div>
                            <LensButtonMin onClick={() => resetLens(lenses[0].id)}>
                                {TrashSvg}
                            </LensButtonMin>
                        </div>
                        <div>
                            {["list", "space"].map((type) => (
                                <LensButtonMin 
                                    onClick={() => changeLensType(lenses[0].id, type)}
                                    style={lenses[0].type !== type ? {borderColor: "#ccc", fill: "#ccc"} : {}}
                                >
                                    {type === "list" ? ListSvg : SpaceSvg}
                                </LensButtonMin>
                            ))}
                        </div>
                    </LensHeader>
                    <Lens
                        key={lenses[0].id}
                        {...lenses[0]}
                        style={LensStyle}
                        onGenerationClick={handleGenerationClick}
                        getGenerationMetadata={lenses[0].type === "space" ? getPositions : (lenses[0].type === "rating" ? getRatings : undefined)}
                    />
                </LensWrapper>
                <LensWrapper style={{flex: 1}}>
                    <Lens
                        key={lenses[1].id}
                        {...lenses[1]}
                        style={LensStyle}
                        onGenerationClick={handleGenerationClick}
                        getGenerationMetadata={lenses[1].type === "space" ? getPositions : (lenses[1].type === "rating" ? getRatings : undefined)}
                    />
                </LensWrapper>
            </LensesContainer>
        </Container>
    )
}

export default CopywritingOuput;