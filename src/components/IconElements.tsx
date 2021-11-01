import styled from 'styled-components';
import { RowDiv, ColDiv } from './appStyleWrappers';

interface IconLabeledItemProps {
  icon_cls_name: string,
  content: string | JSX.Element
}

export function IconLabeledElement(props: IconLabeledItemProps){
  return (
    <RowDiv>
      <SmallIcon className={props.icon_cls_name}/>
      <ColDiv alignItems='start'>
        {props.content}
      </ColDiv>
    </RowDiv>
  );
}

export const SmallIcon = styled.i`
  opacity: 0.8;
`

export const BigIcon = styled.i`
  font-size: var(--iconsize);
  opacity: 0.5;
`

export const Big3DIcon = styled.i`
  font-size: 4rem;
  padding: var(--fontsize_big) 0;
  color: var(--bgcolor);
  text-shadow: -1px 0px 10px var(--bgcolor);
  filter: brightness(1.5) drop-shadow(5px 5px 5px var(--maincolor1));
`