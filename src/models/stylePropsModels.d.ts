/**
 * models used in styled-components as props
 */

interface ContainerProps {
  alignItems?: 'center' | 'stretch' | 'start',
  justifyContent?: 'start' | 'center' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch'
  gap?: 1 | 2 | 3,
  flexGrow?: 1 | 2 | 'unset',
  row?: string,
  col?: string,
  gridArea?: string
}
