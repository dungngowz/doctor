import { Typography } from '@mui/material'

/**
 * `IContainerTitleProps` is an object with a property called `title` that is a string.
 * @property {string} title - The title of the container.
 */
type IContainerTitleProps = {
  title?: string
}

/**
 * A React component that takes in a title prop and returns a Typography component with the title prop
 * as the text.
 * @param {IContainerTitleProps} props - IContainerTitleProps
 * @returns A React component
 */
export const ContainerTitle = (props: IContainerTitleProps) => {
  const { title = '' } = props
  return (
    <>
      {title ? (
        <Typography fontSize={'20px'} fontWeight={500} paddingBottom={2}>
          {title}
        </Typography>
      ) : null}
    </>
  )
}
