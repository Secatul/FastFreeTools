'use client'

import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation'
import { locales } from './i18n'

export const localePrefix = 'always'

export const pathnames = {
  '/': '/',
  '/word-counter': '/word-counter',
  '/credit-card-validator': '/credit-card-validator',
  // '/color-picker': '/color-picker',
  '/binary-to-text': '/binary-to-text',
  '/base64encoder': '/base64encoder',
  '/html-generator': '/html-generator',
  '/html-markdown-converter': '/html-markdown-converter',
  '/markdown-editor': '/markdown-editor',
  '/case-converter': '/case-converter',
  '/json-formatter': '/json-formatter',
  '/lorem-ipsum': '/lorem-ipsum',
  '/password-generator': '/password-generator',
  '/morse-code-translator': '/morse-code-translator',
  '/qrcode-generator': '/qrcode-generator',
  '/text-transformer': '/text-transformer',
  // tests --------
  '/data-table-generator': '/data-table-generator',
  '/user-agent': '/user-agent',

  
  '/online-flowchart-maker': '/online-flowchart-maker',
  '/seo-meta-tag-analyzer': '/seo-meta-tag-analyzer',
  // '/image-background-remover': '/image-background-remover',

  
  

} satisfies Pathnames<typeof locales>;


export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames })
