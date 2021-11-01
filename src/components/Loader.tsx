import styled from 'styled-components';

interface LoaderProps {
  radius?: 1 | 2 | 3
}

export const Loader = styled.div((props: LoaderProps)=>{
  const r = (props.radius || 1) * 30; // radius
  const d = 2 * r; // diameter
  const w = r / 6; // width of circle
  return `
  width: ${d}px;
  height: ${d}px;
  margin: auto;
  background: none;
  position: relative;
  border-radius: 100%;
  
  &:before, &:after {
    content: '';
    position: absolute;
    display: block;
    height: calc(${d}px - ${w * 2}px);
    width: calc(${r}px - ${w}px);
    border: ${w}px solid;
  }
  &:before {
    transform-origin: ${r}px ${r}px;
    animation: RotatingAnime 3s ease infinite;
    border-radius: ${d}px 0 0 ${d}px;
    animation: RotatingAnime 3s ease infinite;
    opacity: 0.8;
    border-color: var(--maincolor1) transparent var(--maincolor1) var(--maincolor1);
  }
  &:after {
    margin-left: calc(${r}px - ${w}px);
    transform-origin: ${w}px ${r}px;
    animation: RotatingAnime 1s ease infinite;
    border-radius: 0 ${d}px ${d}px 0;
    animation: RotatingAnime 3s ease infinite 2s;
    opacity: 0.8;
    border-color: var(--maincolor2) transparent var(--maincolor2) transparent;
  }
`
});