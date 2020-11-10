/*
 * Copyright 2020 Google LLC
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
import { percySnapshot } from '@percy/puppeteer';

/**
 * Internal dependencies
 */
import { createNewStory, previewStory, addTextElement } from '../../../utils';

describe('Inserting text', () => {
  it('should insert a text element with no mask', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await addTextElement();

    const textFrame = 'div[data-testid="frameElement"]';
    await page.waitForSelector(textFrame);
    const ID = await page.evaluate((selector) => {
      return document
        .querySelectorAll(selector)[1]
        .getAttribute('data-element-id');
    }, textFrame);

    const editorPage = page;
    const previewPage = await previewStory(editorPage);

    const element = await previewPage.$(`#el-${ID}`);
    const className = await previewPage.evaluate((el) => el.className, element);

    expect(className.includes('mask')).not.toBeTrue();
    await percySnapshot(previewPage, 'Text has no mask class');

    await editorPage.bringToFront();
    await previewPage.close();
  });
  it('should not cut off the glyphs', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await expect(page).toClick('svg[aria-label="Text library"]');
    const libraryPaneSelector = 'section#library-pane-text';
    await expect(page).toClick(`${libraryPaneSelector} button`);
    const textFrame = 'div[data-testid="frameElement"]';
    await page.waitForSelector(textFrame);
    await page.keyboard.type('yes!');

    await expect(page).toClick('button[aria-label="Edit: Font family"]');
    await expect(page).toClick(
      'li[role="option"][data-font="Nothing You Could Do"]'
    );

    const textElementSelector = 'span[data-text=true]';
    await page.waitForSelector(textElementSelector);
    await expect(page).toMatchElement(textElementSelector, {
      text: 'yes!',
    });

    await expect(page).toClick('li#library-tab-media');
    await expect(page).toClick('div#wpbody');

    const editorPage = page;
    const previewPage = await previewStory(editorPage);

    await percySnapshot(previewPage, 'Text glyphs are not cut off');
  });
});
