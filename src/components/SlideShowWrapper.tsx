import { 
  useRef,
  ReactNode
} from 'react';
import {IconCircleButton} from './ButtonComponent';
import { GridDiv, RowInGridDiv } from './appStyleWrappers';
import { fadeInEffect } from '../libs/componentEffects';
import {default as ICON_MAP} from '../datastore/app_icon_map.json';

interface SlideShowProps {
  children: ReactNode,
  max_page: number,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>
}
/**
 * @param props 
 * - max_page: number, the max page of content;
 * - page: number of current page.
 * - setPage: React.Dispatch<React.SetStateAction<number>> to control page.
 * - children: ReactNode.
 */
export default function SlideShowWrapper(props: SlideShowProps){
  const ref_for_effect = useRef<HTMLDivElement>(null); 

  const changePage = (change_amount: number) => {
    const new_page = props.page + change_amount;
    if (new_page < 0 || new_page === props.max_page){
      return;
    }
    setTimeout(()=> {
      props.setPage(new_page);
    }, 20);
    fadeInEffect(ref_for_effect);
  }
  const nextPage = () => {
    changePage(1);
  }
  const prePage = () => {
    changePage(-1);
  }
  return (
    <GridDiv
      col='var(--iconradius) 1fr var(--iconradius)'
    >
      <RowInGridDiv
        ref={ref_for_effect}
        alignItems='stretch'
        gridArea='1/ 2/ 1/ 2'
      >
        {props.children}
      </RowInGridDiv>
      <RowInGridDiv
        justifyContent='space-between'
        gridArea='1/ 1/ 1/ 4'
      >
        <IconCircleButton
          icon_cls_name={ICON_MAP.prev_page}
          is_disabled={props.page === 0}
          func={prePage}
        />
        <IconCircleButton
          icon_cls_name={ICON_MAP.next_page}
          is_disabled={props.page === props.max_page}
          func={nextPage}
        />
      </RowInGridDiv>
    </GridDiv>
  );
}