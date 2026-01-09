import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { html, render } from 'https://esm.sh/lit-html';

export default function decorate(block) {
  const cards = [...block.children].map((row) => {
    const cols = [...row.children].map((div) => {
      let className = 'cards-card-body';
      let content = [...div.childNodes];

      if (div.children.length === 1 && div.querySelector('picture')) {
        className = 'cards-card-image';
        const img = div.querySelector('img');
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimized.querySelector('img'));
        content = optimized;
      }
      return { className, content };
    });

    return { source: row, cols };
  });

  const template = html`
    <ul>
      ${cards.map((card) => html`
        <li class="card-item">
          ${card.cols.map((col) => html`
            <div class="${col.className}">${col.content}</div>
          `)}
        </li>
      `)}
    </ul>
  `;

  block.innerHTML = '';
  render(template, block);

  // Restore Instrumentation
  const lis = block.querySelectorAll('ul > li');
  cards.forEach((card, index) => {
    if (lis[index]) {
      moveInstrumentation(card.source, lis[index]);
    }
  });
}
