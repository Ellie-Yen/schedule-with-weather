import styled, {css} from "styled-components";

export function getCenterAlignCss(props: ContainerProps = {}){
  return `
    align-items: ${props.alignItems || 'center'};
    justify-content: ${props.justifyContent || 'center'};
    gap: var(--gap${props.gap || 1});
  `;
}

export function getVerticalFlexCss(props: ContainerProps = {}){
  return `
    display: flex;
    flex-grow: ${props.flexGrow || 1};
    flex-direction: column;
    ${getCenterAlignCss(props)}
  `;
}

export function getHorizonalFlexCss(props: ContainerProps = {}){
  return `
    display: flex;
    flex-grow: ${props.flexGrow || 1};
    flex-direction: row;
    ${getCenterAlignCss(props)}
  `;
}

export function getGridCss(props: ContainerProps = {}){
  return `
    display: grid;
    grid-template: ${props.row || '1fr'} / ${props.col || '1fr'};
    ${getCenterAlignCss(props)}
    grid-gap: var(--gap${props.gap || 1});
  `;
}

export function getCircleCss(diameter: string = 'var(--iconsize)'){
  return `
    display: flex;
    border-radius: 100%;
    ${getCenterAlignCss()}
    height: ${diameter};
    width: ${diameter};
  `;
}

export const BigRoundCss = css`
  border-radius: var(--iconradius);
  padding: var(--iconradius);
`

export const SmallRoundCss = css`
  border-radius: var(--gap1);
  padding: var(--gap1);
`

export const CircleSideCss = css`
  border-radius: var(--iconsize);
  height: var(--iconsize);
  min-width: var(--iconsize);
  padding: 5px var(--iconradius);
`;

export const ShadowCss = css`
  box-shadow: 0 0 var(--gap3) 1px var(--shadowcolor);
  &:hover {
    box-shadow: var(--gap2) var(--gap2) var(--gap3) 5px var(--shadowcolor);
  }
`
export const CircleCss = css`
  border-radius: 100%;
  padding: 5px;
  height: var(--iconsize);
  width: var(--iconsize);
`

export const RowDiv = styled.div((props: ContainerProps)=>`
  ${getHorizonalFlexCss(props)}
`);

export const ColDiv = styled.div((props: ContainerProps)=>`
  ${getVerticalFlexCss(props)}
`);

export const GridDiv = styled.div((props: ContainerProps) =>`
  ${getGridCss(props)}
`)

export const RowInGridDiv = styled.div((props: ContainerProps) => `
  ${getHorizonalFlexCss(props)}
  grid-area: ${props.gridArea || 'unset'};
`)

export const ColInGridDiv = styled.div((props: ContainerProps) => `
  ${getVerticalFlexCss(props)}
  grid-area: ${props.gridArea || 'unset'};
`)

export const CenterTitle = styled.h1`
  text-align: center;
`
