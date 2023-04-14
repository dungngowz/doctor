import NextHeadSeo from 'next-head-seo'

/**
 * `MyPageSeoProps` is an object with optional properties `title`, `description`, and
 * `noTitleTemplate`.
 * @property {string} title - The title of the page.
 * @property {string} description - The description of the page.
 * @property {boolean} noTitleTemplate - If you don't want to use the default title template, set this to true.
 */
type MyPageSeoProps = {
  title?: string
  description?: string
  noTitleTemplate?: boolean
}

/**
 * It takes in a title and description and returns a NextHeadSeo component with the title and
 * description
 * @param props
 */
export const HeadPage: React.FC<MyPageSeoProps> = (props) => {
  const { title = 'ERP', description = 'Default description', noTitleTemplate } = props

  return (
    <NextHeadSeo title={noTitleTemplate ? title : `${title} | ERP`} description={description} />
  )
}
