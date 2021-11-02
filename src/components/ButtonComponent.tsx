// import order: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
import styled from 'styled-components';
import {
  CircleSideCss, CircleCss, RowDiv, ColDiv, ShadowCss,
  getHorizonalFlexCss
} from './appStyleWrappers';
import { SmallIcon } from './IconElements';;

interface ButtonElementProps {
  is_primary?: boolean,
  is_disabled?: boolean
}

interface ButtonProps extends ButtonElementProps{
  func: React.MouseEventHandler
}

interface CircleSideButtonProps extends ButtonProps {
  content: JSX.Element | string
}
/**
 * @param props
 * - cls_name: string of additional classname
 * - func: export function that to display when cliking it
 * - is_disabled, is_primary: bool indicates the status of the button
 */
export function CircleSideButton(props: CircleSideButtonProps){
  return (
    <CircleSideBtn
      disabled={props.is_disabled}
      is_primary={props.is_primary}
      onClick={props.func}
    >
      <RowDiv>{props.content}</RowDiv>
    </CircleSideBtn>
  );
}

interface IconButtonProps extends ButtonProps {
  icon_cls_name: string
}
/**
 * @param props
 * - cls_name: string of additional classname
 * - icon_cls_name: string, bootstrap classname
 * - func: export function that to display when cliking it
 * - is_disabled, is_primary: bool indicates the status of the button
 */
export function IconCircleButton(props: IconButtonProps){
  return (
    <CircleBtn
      disabled={props.is_disabled}
      is_primary={props.is_primary}
      onClick={props.func}
    >
      <SmallIcon className={props.icon_cls_name} />
    </CircleBtn>
  );
}

interface IconTitledButtonProps extends IconButtonProps {
  content: JSX.Element | string
}
/**
 * @param props
 * - cls_name: string of additional classname
 * - icon_cls_name: string, bootstrap classname
 * - func: export function that to display when cliking it
 * - is_disabled, is_primary: bool indicates the status of the button
 * - content: string as the button description
 */
export function IconTitledButton(props: IconTitledButtonProps){
  return (
    <CircleSideBtn
      disabled={props.is_disabled}
      is_primary={props.is_primary}
      onClick={props.func}
    >
      <SmallIcon className={props.icon_cls_name}/>
      <ColDiv>{props.content}</ColDiv>
    </CircleSideBtn>
  );
}

const HoverEffect = `
  &:hover {
    cursor: pointer;
    background: linear-gradient(var(--bgcolor) 50%, var(--maincolor2) 50%);
    background-size: 200% 200%;
    animation: 1s ease 0s 1 normal forwards running FillAnime;
  }
`;
const Btn = styled.button((props: ButtonElementProps)=> `
  ${getHorizonalFlexCss()}
  background: var(--${props.is_primary? 'maincolor1': 'bgcolor'});
  border: none;
  transition-duration: 2s;
  ${HoverEffect}
  &:disabled {
    opacity: 0.5;
  }
  &:disabled:hover {
    cursor: not-allowed;
    background: var(--bgcolor);
  }
`)
const CircleSideBtn = styled(Btn)`
  ${CircleSideCss}
`;
const CircleBtn = styled(Btn)`
  ${CircleCss}
  ${ShadowCss}
  flex-grow: unset;
  transform: scale(1.25);
`;