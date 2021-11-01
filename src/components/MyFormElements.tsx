import {
  useState, useRef, useEffect,
  ChangeEvent,
  MouseEvent, MouseEventHandler,
  ReactNode
} from 'react';

import styled, {css} from 'styled-components';
import {
  CircleCss, CircleSideCss, SmallRoundCss, getVerticalFlexCss,
  GridDiv, RowInGridDiv, RowDiv, ColDiv
} from './appStyleWrappers';
import { SmallIcon } from './IconElements';
import { CircleSideButton, IconTitledButton } from './ButtonComponent';
import { 
  DisplayController,
  DynamicContentContainer
} from './SwitchShowElement';

import {default as ICON_MAP} from '../datastore/app_icon_map.json';

interface MyFormProps {
  children: ReactNode,
  question: string,
  submit_func: MouseEventHandler,
  cancel_func: MouseEventHandler
}
export function MyForm(props: MyFormProps){
  const {
    is_hide,
    ref_content,
    switchDisplay,
    stopEvent
  } = DisplayController();

  // if form data is needed for third parties, use following method in form's onSubmit:
  // https://github.com/final-form/react-final-form/issues/878#issuecomment-745364350
  const formRef= useRef<HTMLFormElement>(null);
  const handleSubmit = (event: MouseEvent) => {
    if (! formRef.current){
      return;
    }
    if (formRef.current.reportValidity()){
      props.submit_func(event);
      switchDisplay(event);
    }
  }
  const handleCancel = (event: MouseEvent) => {
    props.cancel_func(event);
    switchDisplay(event);
  }

  return (
    <ColDiv flexGrow='unset'>
      <CircleSideButton
        content={props.question}
        func={switchDisplay}
      />
      <DynamicContentContainer
        hidden={is_hide}
      >
        <Board
          ref={ref_content}
          onClick={switchDisplay}
        >
          <MyFormWrapper
            ref={formRef}
            onClick={stopEvent}
          >
            {props.children}
            <RowDiv>
              <IconTitledButton
                is_primary={true}
                content="確認"
                icon_cls_name={ICON_MAP.checked}
                func={handleSubmit}
              />
              <IconTitledButton
                content="取消"
                icon_cls_name={ICON_MAP.canceled}
                func={handleCancel}
              />
            </RowDiv>
          </MyFormWrapper>
        </Board>
      </DynamicContentContainer>
    </ColDiv>
  );
}

interface PasswordInputComponentProps {
  label: string,
  value: string,
  setValue: (s: string) => any,
  icon_cls_name: string
}
export function PasswordInputComponent(props: PasswordInputComponentProps){
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [msg, setMsg] = useState('');
  const refInput = useRef<HTMLInputElement>(null);
  const handleSwitch = () => {
    setHidePassword(! hidePassword);
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMsg(event.target.validationMessage);
    props.setValue(event.target.value);
  }
  useEffect(() => {
    if (refInput.current?.validationMessage){
      setMsg(refInput.current?.validationMessage);
    }
  }, [refInput]);

  const [inputType, statusIcon] = hidePassword ? 
    ['password', ICON_MAP.password_is_hide]:
    ['text', ICON_MAP.password_is_show]
  ;
  return (
    <InputSection
      label={props.label}
    >
      <i>{msg}</i>
      <GridDiv>
        <IconContainer
          gridArea='1/1/1/1'
          alignItems='stretch'
          justifyContent='space-between'
        >
          <SmallIcon className={props.icon_cls_name}/>
          <SmallIcon 
            className={statusIcon}
            onClick={handleSwitch}
          />
        </IconContainer>
        <RowInGridDiv
          gridArea='1/1/1/1'
          alignItems='stretch'
        >
          <MyInput
            ref={refInput}
            name={props.label}
            value={props.value}
            onChange={handleChange}
            type={inputType}
            required
          />
        </RowInGridDiv>
      </GridDiv>
    </InputSection>
  );
}

interface SelectComponentProps {
  label: string,
  option_list: Array<string>,
  value: string,
  setValue: (s: string) => any
}
export function SelectInputComponent(props: SelectComponentProps){
  return (
    <InputSection
      label={props.label}
    >
      <ColDiv
        justifyContent='stretch'
        alignItems='stretch'
      >
        <HiddenSelectElement
          label={props.label}
          value={props.value}
          option_list={props.option_list}
        />
        <DummySelectElement
          label={props.label}
          value={props.value}
          setValue={props.setValue}
          option_list={props.option_list}
        />
      </ColDiv>
    </InputSection>
  ); 
}

interface ToggleCheckComponentProps {
  label: string,
  msg_checked: string,
  value: boolean,
  setValue: (bool: boolean) => any
}
export function ToggleCheckComponent(props: ToggleCheckComponentProps){
  // deal with old bugs of checkbox, radio button. 
  // https://github.com/facebook/react/issues/21094
  const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setTimeout(() => props.setValue(! props.value), 0)
  }
  return (
    <InputSection
      label={props.label}
    >
      <RowDiv>
        <MyCheckBox
          name={props.label}
          type='checkbox'
          value={`${props.value}`}
          checked={props.value}
          onChange={handleCheck}
        />
        {props.msg_checked}
      </RowDiv>
    </InputSection>
  );
}

interface InputSectionProps {
  children: ReactNode,
  label: string
}
function InputSection(props: InputSectionProps){
  return (
    <MyFieldSet>
      <label htmlFor={props.label}>
        {props.label}
      </label>
        {props.children}
    </MyFieldSet>
  );
}

interface HiddenSelectElementProps {
  label: string,
  value: string,
  option_list: Array<string>
}
function HiddenSelectElement(props: HiddenSelectElementProps){
  const [msg, setMsg] = useState('');
  const refSelect = useRef<HTMLSelectElement>(null);

  // unlike input element, here the value is not decided by itself.
  // thus need to 'recover' the msg if value is changed and it's valid;
  useEffect(() => {
    if (! refSelect.current){
      return;
    }

    refSelect.current.value = props.value;
    if (refSelect.current.reportValidity()){
      setMsg('');
    }
    else {
      refSelect.current.focus();
      setMsg(refSelect.current.validationMessage);
    }
  }, [props.value, refSelect]);

  return (
    <>
    <i>{msg}</i>
    <HiddenSelect
      ref={refSelect}
      name={props.label}
      value={props.value}
      onChange={()=> {}}
      required={true}
    >
      <option value=''/>
      {props.option_list.map((op, i)=>
        <option value={op} key={`op-${i}`}>
          {op}
        </option>
      )}
    </HiddenSelect>
    </>
  );
}

interface DummySelectElementProps {
  label: string,
  value: string,
  setValue: (s: string) => any,
  option_list: Array<string>
}
function DummySelectElement(props: DummySelectElementProps){
  const {
    is_hide,
    ref_content,
    switchDisplay,
    stopEvent
  } = DisplayController();

  const selectItem = (op: string) => {
    return (event: MouseEvent) => {
      switchDisplay(event);
      props.setValue(op);
    }
  }
  return (
    <>
    <DummySelect
      col='var(--iconradius) 1fr var(--iconradius)'
      onClick={switchDisplay}
    >
      <i/>
      {props.value || props.label}
      <SmallIcon className={is_hide ? 
        ICON_MAP.extend_content:
        ICON_MAP.fold_content
      }/>
    </DummySelect>
     
    <DynamicContentContainer
      hidden={is_hide}
    >
      <ContentBoard
        ref={ref_content}
        onClick={switchDisplay}
        justifyContent='start'
        alignItems='stretch'
      >
        <GridDiv
          row='auto'
          col='repeat(3, 1fr)'
          onClick={stopEvent}
        >
          {props.option_list.map((op, i)=>
            <CircleSideButton
              content={op}
              func={selectItem(op)}
              is_primary={op === props.value}
              key={`option-${i}`}
            />
          )}
        </GridDiv>
      </ContentBoard>
    </DynamicContentContainer>
  </>
  );
}

const FormElementCSS = css`
  background: var(--bgcolor);
  box-shadow: 1px 1px 5px 0px var(--shadowcolor);
`;
const MyFormWrapper = styled.form`
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
`;

const MyInput = styled.input`
  ${CircleSideCss}
  ${FormElementCSS}
  padding: 5px calc(var(--iconsize) + 5px);
  display: flex;
  flex-grow: 1;
  border: none;
  outline:none;
  &:focus {
    border: none;
    outline:none;
    background: var(--maincolor1);
  }
`; 
const MyCheckBox = styled.input`
  appearance: none;
  cursor: pointer;
  ${CircleSideCss}
  ${FormElementCSS}
  padding: 5px 0;
  transition-duration: 2s;
  &:checked {
    background: var(--maincolor2);
  }
  &:before, &:after {
    ${CircleCss}
    position: relative;
  }
  &:after {
    content: 'on';
    margin-left: var(--gap1);
  }
  &:before {
    content: 'off';
  }
  &:after, &:checked:before {
    color: transparent;
    background: var(--bgcolor);
    border: 1px solid var(--shadowcolor);
    box-shadow: 1px 1px 5px 0px var(--shadowcolor);
  }
  &:before, &:checked:after {
    color: var(--fontcolor);
    background: none;
    border: none;
    box-shadow: none;
  }
`; 
const DummySelect = styled(GridDiv)`
  ${CircleSideCss}
  ${FormElementCSS}
  cursor: pointer;
  transition-duration: 2s;
  &:hover {
    background: var(--maincolor2);
  }
`;
const HiddenSelect = styled.select`
  height: 0px;
  width: 0px;
  opacity: 0;
`
const IconContainer = styled(RowInGridDiv)`
  padding: var(--iconradius);
`
const ContentBoard = styled(ColDiv)`
  ${SmallRoundCss}
  ${FormElementCSS}
`
const Board = styled(ColDiv)`
  background: var(--assistcolor);
  backdrop-filter: blur(var(--gap3));
  position: fixed;
  top: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  & > {
    width: fit-content;
  }
`
const MyFieldSet = styled.fieldset`
  ${getVerticalFlexCss()}
  margin: var(--gap2) 0;
  border: none;
  &:invalid {
    border-right: var(--gap1) solid var(--maincolor2);
  }
`;