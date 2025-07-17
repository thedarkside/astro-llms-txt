import type { RootContent } from 'hast';
import { selectAll } from 'hast-util-select';
import { remove } from 'unist-util-remove';

/**
 * Custom transformer that mimics common accessibility rules followed by browsers:
 * 1. aria-label replaces the subtree with the content of the attribute
 * 2. aria-hidden removes the subtree
 */
export function accessibilityTransformer() {
  return (tree: any) => {

    // Handle aria-hidden elements (remove them)
    remove(tree, (node: RootContent) => {
      return node.type === 'element' &&
          node.properties &&
          (node.properties['ariaHidden'] === true || node.properties['ariaHidden'] === 'true');
    });

    // Handle img with alt=""
    remove(tree, (node: RootContent) => {
      return node.type === 'element' &&
          node.tagName === 'img' &&
          node.properties &&
          node.properties['alt'] === "";
    });
    
    // Handle aria-label elements (replace content with aria-label)
    const ariaLabelElements = selectAll('[aria-label]', tree as Parameters<typeof selectAll>[1]);

    for (const element of ariaLabelElements) {
      let ariaLabelValue: string | null = null;
      
      if (element.properties) {
        // Check for camelCase property first (as shown in the logs)
        if (element.properties['ariaLabel'] !== undefined && 
            element.properties['ariaLabel'] !== null && 
            element.properties['ariaLabel'] !== '') {
          ariaLabelValue = element.properties['ariaLabel'] as string;
        }
      }
      
      // Process the element if we found a valid aria label value
      if (ariaLabelValue) {
        // Clear existing children
        element.children = [];

        // Add aria-label content as text node
        element.children.push({
          type: 'text',
          value: ariaLabelValue
        });
      }
    }

    return tree;
  };
}