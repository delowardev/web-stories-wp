/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useState, forwardRef, useFocusOut } from '@web-stories-wp/react';
import styled from 'styled-components';
import { _x, sprintf } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_TYPES,
  themeHelpers,
} from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../../../types';
import { focusStyle } from '../../../panels/shared';
import { PAGE_TEMPLATE_TYPES } from './constants';

const PageTemplateWrapper = styled(Button).attrs({ type: BUTTON_TYPES.PLAIN })`
  position: relative;
  display: flex;
  flex-direction: column;
  height: auto;
  width: ${({ columnWidth }) => columnWidth}px;
  padding: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  cursor: pointer;

  ${({ isHighlighted }) => isHighlighted && themeHelpers.focusCSS};
  ${focusStyle};
`;

const PosterWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PosterImg = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const PageTemplateTitle = styled.div`
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.opacity.overlayDark};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};

  padding: 8px;
  font-size: 12px;
  line-height: 22px;
  width: 100%;
  align-self: flex-end;
`;

PageTemplateTitle.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

const DefaultPageTemplate = forwardRef(
  ({ page, pageSize, columnWidth, ...rest }, ref) => {
    const [isActive, setIsActive] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const isActivePage = isHover || isActive;

    useFocusOut(ref, () => setIsHover(false), []);

    const { highlightedTemplate } = rest;

    const handleSetHover = () => setIsHover(!isHover);
    return (
      <PageTemplateWrapper
        columnWidth={columnWidth}
        ref={ref}
        onMouseEnter={handleSetHover}
        onMouseLeave={handleSetHover}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        aria-label={page.title}
        isHighlighted={page.id === highlightedTemplate}
        {...rest}
      >
        <PosterWrapper>
          {page.webp && (
            <PosterImg
              src={page.png}
              alt={page.title}
              crossOrigin="anonymous"
            />
          )}
          {page.title && (
            <PageTemplateTitle isActive={isActivePage}>
              {sprintf(
                /* translators: 1: template name. 2: page template
            name. */ _x('%1$s %2$s', 'page template title', 'web-stories'),
                page.title,
                PAGE_TEMPLATE_TYPES[page.type].name
              )}
            </PageTemplateTitle>
          )}
        </PosterWrapper>
      </PageTemplateWrapper>
    );
  }
);

DefaultPageTemplate.propTypes = {
  isActive: PropTypes.bool,
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  columnWidth: PropTypes.number.isRequired,
};

DefaultPageTemplate.displayName = 'DefaultPageTemplate';

export default DefaultPageTemplate;
