import {ReactNode} from 'react';
import styled from 'styled-components';

import { ColDiv } from './appStyleWrappers';
import { IconCircleButton } from './ButtonComponent';
import { 
  DisplayController,
  DynamicContentContainer
} from './SwitchShowElement';


interface MenuWrapperProps {
  children: ReactNode,
  icon_cls_name: string
}
/**
 * @param props includes following keys:
 * - content: JSX.Element | string, content to display in menu.
 * - icon_cls_name: bootstrap icon classname for switch button.
 */
export function MenuWrapper(props: MenuWrapperProps){
  const {
    is_hide,
    ref_content,
    switchDisplay,
    stopEvent
  } = DisplayController();

  return (
    <>
      <IconCircleButton
        is_primary={true}
        icon_cls_name={props.icon_cls_name}
        func={switchDisplay}
      />
      <DynamicContentContainer
        hidden={is_hide}
      >
        <MenuBoard
          ref={ref_content}
          onClick={switchDisplay}
        >
          <ContentContainer
            onClick={stopEvent}
          >
            {props.children}
          </ContentContainer>
        </MenuBoard>
      </DynamicContentContainer>
    </>
  ); 
}

const MenuBoard = styled(ColDiv)`
  background: var(--assistcolor);
  backdrop-filter: blur(var(--gap1));
  position: fixed;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: -1;
`

const ContentContainer = styled(ColDiv)`
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
`