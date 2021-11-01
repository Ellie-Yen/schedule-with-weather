import {
  useState, useRef, MutableRefObject, 
  MouseEvent, MouseEventHandler
} from 'react';
import styled from 'styled-components';
import {showContentEffect, hideContentEffect} from '../libs/componentEffects';

interface SwitchShowController {
  is_hide: boolean,
  switchDisplay: MouseEventHandler,
  stopEvent: MouseEventHandler,
  ref_content: MutableRefObject<null>
}

/**
 * @return SwitchShowController, a object contains following key:
 * - is_hide: boolean, the display status of main content, init is true.
 * - switchDisplay: MouseEventHandler to controll the visibility of main content.
 * - stopEvent: MouseEventHandler to avoid switching display status.
 * - ref_content: MutableRefObject<null>, as the ref for the main content.
 */
export function DisplayController(): SwitchShowController {
  const [is_hide, setHide] = useState<boolean>(true);
  const ref_content = useRef(null);
  const switchDisplay = (event: MouseEvent) => {
    stopEvent(event);
    if (is_hide){
      setHide(false);
      showContentEffect(ref_content);
      return;
    }
    hideContentEffect(ref_content);
    setTimeout(()=>{ setHide(true);}, 501);
  }

  const stopEvent = (event: React.MouseEvent) => {
    // possible to be nested, 
    // stop event bubbling / capturing to avoid close all content
    event.preventDefault()
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }
  return {
    is_hide,
    ref_content,
    switchDisplay,
    stopEvent
  };
}

interface DynamicContentContainerProps extends ContainerProps {
  hidden: boolean
}

export const DynamicContentContainer = styled.div((props: DynamicContentContainerProps)=>`
  ${props.hidden ? '': 'display: contents;'}
`);