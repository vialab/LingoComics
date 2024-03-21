import type { TouchDraggableOptions } from "../../utils/types";

export function mouseDraggable(node: HTMLElement, options: TouchDraggableOptions) {
    let highlightedElement: HTMLElement | null = null;
    const originalWidth = node.offsetWidth;
    const originalBackgroundColor = node.style.backgroundColor;
    const originalBorderRadius = node.style.borderRadius;

    node.style.transition = 'all 0.5s ease';

    // handle the event when the user starts clicking
    function handleMouseDown(event: MouseEvent) {
        event.preventDefault();

        node.style.width = `${originalWidth}px`;
        node.style.borderRadius = originalBorderRadius;
        node.style.position = 'fixed';
        node.style.zIndex = '1000';

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    // handle event when user is dragging the element
    function handleMouseMove(event: MouseEvent) {
        const newX = event.clientX;
        const newY = event.clientY;

        // no transition when moving
        node.style.transition = '';

        node.style.left = `${newX}px`;
        node.style.top = `${newY}px`;

        // Determine the element currently under the drag (for highlighting)
        const currentDropTarget = document.elementFromPoint(newX, newY);
        if (currentDropTarget && currentDropTarget.tagName === 'IMG') {
            if (highlightedElement !== currentDropTarget) {
                if (highlightedElement) {
                    highlightedElement.style.border = '';
                }
                highlightedElement = currentDropTarget as HTMLElement;
                highlightedElement.style.border = '3px solid #FF8A80';
            }
        } else {
            if (highlightedElement) {
                highlightedElement.style.border = '';
                highlightedElement = null;
            }
        }
    }

    function handleMouseUp(event: MouseEvent) {
        node.style.transition = 'all 0.5s ease';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        const dropTarget = document.elementFromPoint(event.clientX, event.clientY);
        if (!(dropTarget && dropTarget.tagName === 'IMG')) {
            resetDraggableStyles();
            options.removePair({ draggable: node, target: dropTarget as HTMLElement });
        } else {
            draggableStyleOnSnap(dropTarget);
            options.addPair({ draggable: node, target: dropTarget as HTMLElement });
        }
    }

    // Reset draggable nodes styling
    function resetDraggableStyles() {
        node.style.position = '';
        node.style.left = ``;
        node.style.top = ``;
        node.style.zIndex = '';

        node.style.backgroundColor = originalBackgroundColor;
        node.style.borderRadius = originalBorderRadius;
        node.style.border = '';
        node.style.transform = ''
        node.style.width = ``;   
    }

    // Apply styles to draggable node
    function draggableStyleOnSnap(dropTarget: Element) {
        const rect = dropTarget.getBoundingClientRect();
        node.style.left = `${rect.left + 3}px`;
        node.style.top = `${rect.bottom - node.offsetHeight - 6}px`;
        node.style.backgroundColor = '#fffffff1';
        node.style.borderRadius = '0';
        node.style.border = '2px solid black';
        if (highlightedElement) node.style.width = `${highlightedElement?.offsetWidth - 5}px`;
        if (highlightedElement) highlightedElement.style.border = '';
    }

    node.addEventListener('mousedown', handleMouseDown);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    }

}