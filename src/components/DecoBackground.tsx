import styled from 'styled-components';

interface DecoBackgroundProps {
  img_url: string;
}
export function DecoBackground(props: DecoBackgroundProps){
  return (
    <DecoBackgroundDiv>
      <DecoImg src={props.img_url} alt='deco_pic'/>
    </DecoBackgroundDiv>
  );
}

const DecoBackgroundDiv = styled.div`
  background: linear-gradient(45deg, var(--maincolor2), var(--maincolor1));
  box-shadow: 50px 50px 70px 50px var(--shadowcolor);
`;

const DecoImg = styled.img`
  object-fit: cover;
`