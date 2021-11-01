import styled, {css} from 'styled-components';
import {
  ShadowCss, BigRoundCss,
  RowDiv, ColDiv, GridDiv
} from './appStyleWrappers';

// use muti-layer css (ex GeneralCardCss) in template might cause error
// avoid doing that.
export const VerticalFlexRoundCard = styled(ColDiv)((props: ContainerProps) => GeneralCardCss)

export const BigGridRoundCard = styled(GridDiv)((props: ContainerProps) => GeneralCardCss)

export const LeftBorderCard = styled(RowDiv)((props: ContainerProps) => `
  padding: var(--gap2);
  &:hover {
    cursor: pointer;
    background: var(--assistcolor);
  }
  &:before {
    content: "";
    width: var(--gap2);
    height: calc(100% + var(--gap2) + var(--gap2));
    transform: translateX(calc(0px - var(--gap2)));
    background: var(--maincolor1);
  }
  &:hover:before {
    background: linear-gradient(var(--maincolor1) 50%, var(--maincolor2) 50%);
    background-size: 200% 200%;
    animation: 1s ease 0s 1 normal forwards running FillAnime;
  }
`)

const GeneralCardCss = css`
  ${BigRoundCss}
  ${ShadowCss} 
  backdrop-filter: blur(var(--gap1));
  background: var(--bgcolor_trans);
`;