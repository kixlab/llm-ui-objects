import React from 'react';
import styled from 'styled-components';

import { key } from './components/Api';

import Storywriting from './components/Storywriting';
import Copywriting from './components/Copywriting';

const KeySvg =
  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
    <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/>
  </svg>
;

const Container = styled.div`
  width: calc(100% - 64px);
  height: calc(100% - 48px);
  background-color: #eee;
  position: relative;
  z-index: 0;
  padding: 16px 32px 32px 32px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const KeyContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: flex-end;
  flex: 1;
`;

const KeyInput = styled.input`
  width: 200px;
  height: 32px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  box-sizing: border-box;
`;

const KeyButton = styled.div`
  width: 32px;
  height: 32px;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  background-color: #ccc;
  fill: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AppSwitcher = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex: 1;
`;

const AppButton = styled.div<{selected?: boolean}>`
  width: 140px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => props.selected ? '#0088ff' : '#ccc'};
  color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

function App() {
  const [keyOpen, setKeyOpen] = React.useState(false);
  const [keyInput, setKeyInput] = React.useState(key.value);

  const [app, setApp] = React.useState('storywriting');

  return (
    <Container onClick={() => setKeyOpen(false)}>
      <Header>
        <AppSwitcher>
          <AppButton 
            selected={app === "storywriting"}
            onClick={() => setApp("storywriting")}
          >
            Storywriting
          </AppButton>
          <AppButton
            selected={app === "copywriting"}
            onClick={() => setApp("copywriting")}
          >
            Copywriting
          </AppButton>
        </AppSwitcher>
        <KeyContainer>
          <KeyInput 
            placeholder="Enter API key" 
            onChange={(e: any) => {
              key.value = e.target.value;
              setKeyInput(e.target.value);
            }}
            onClick={(e: any) => e.stopPropagation()}
            style={{display: keyOpen ? 'block' : 'none'}}
            value={keyInput}
            type="password"
          />
          <KeyButton 
            onClick={(e) => {
              e.stopPropagation();
              setKeyOpen(!keyOpen);
            }}
          >
            {KeySvg}
          </KeyButton>
        </KeyContainer>
      </Header>
      <Storywriting display={app === "storywriting"}/>
      <Copywriting display={app === "copywriting"}/>
    </Container>
  );
}

export default App;
