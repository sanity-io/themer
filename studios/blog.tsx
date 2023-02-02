import { BookIcon } from '@sanity/icons'
import { visionTool } from '@sanity/vision'
import { defineType,type WorkspaceOptions } from 'sanity'
import { deskTool } from 'sanity/desk'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import slugify from 'slugify'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_BLOG_DATASET

const postType = defineType({
  name: 'post',
  type: 'document',
  title: 'Post',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => {
        return Rule.required().custom(async (value: any) => {
          const currentSlug = value && value.current
          if (!currentSlug) {
            return true
          }

          if (currentSlug.length >= 96) {
            return `Must be less than ${96} characters`
          }

          if (currentSlug !== slugify(currentSlug, { lower: true })) {
            return 'Must be a valid slug'
          }
          return true
        })
      },
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'string',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
  ],
})
const authorType = defineType({
  name: 'author',
  type: 'document',
  title: 'Author',
  liveEdit: true,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'picture',
      title: 'Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
})
const types = [postType, authorType]

export const config: WorkspaceOptions = {
  name: 'blog',
  title: 'Blog',
  basePath: '/blog',
  icon: BookIcon,
  projectId,
  dataset,
  plugins: [deskTool(), unsplashImageAsset(), visionTool()],
  schema: { types },
}
