import { createConfig } from 'sanity'

import { config as blog } from './blog'
import { config as movies } from './movies'

export const config = createConfig([movies, blog])
