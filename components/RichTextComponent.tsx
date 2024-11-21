import React from 'react';
import { PortableTextComponents } from '@portabletext/react';
// import { urlFor } from '../lib/sanity';
import { Box, Image, Text } from '@mantine/core';
import { urlForImage } from '@/sanity/lib/image';

export const RichTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <Image src={urlForImage(value)} w="90%" mx="auto" alt="" my="2rem" />
    ),

    callToAction: ({ value, isInline }) =>
      isInline ? <a href={value.url}>{value.text}</a> : <Box>{value.text}</Box>,
  },

  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => (
      <ol style={{ marginTop: '0.5rem' }}>{children}</ol>
    ),

    // Ex. 2: rendering custom lists
    checkmarks: ({ children }) => (
      <ol style={{ margin: '0.5rem auto' }}>{children}</ol>
    ),
  },

  block: {
    h1: ({ children }) => (
      <Text
        fs={{ lg: '24px', base: '12px' }}
        fw="700"
        ta={{ lg: 'left' }}
        mb="1rem"
      >
        {children}
      </Text>
    ),

    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
};
