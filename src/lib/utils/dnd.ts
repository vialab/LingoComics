export function touchDraggable(node: HTMLElement) {
    let highlightedElement : HTMLElement | null = null;
    const originalWidth : number = node.offsetWidth;
    const originalBackgroundColor : string = node.style.backgroundColor;
    const originalBorderRadius : string = node.style.borderRadius;

    // handle the event when the user starts touching
    function handleTouchStart() {
        const originalWidth = `${node.offsetWidth}px`;

        node.style.width = originalWidth;
        node.style.borderRadius = originalBorderRadius;
        node.style.position = 'fixed';
        node.style.zIndex = '1000';

        node.addEventListener('touchmove', handleTouchMove);
        node.addEventListener('touchend', handleTouchEnd);
    }

    // handle the event when the user is dragging the element
    function handleTouchMove(event: TouchEvent) {
        event.preventDefault();

        const touch = event.touches[0];
        const newX = touch.clientX;
        const newY = touch.clientY;

        node.style.left = `${newX}px`;
        node.style.top = `${newY}px`;

        // determine the element currently under the drag
        const currentDropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        if (currentDropTarget && currentDropTarget.tagName === 'IMG') {
            if (highlightedElement !== currentDropTarget) {
                // reset previously highlighted element if any
                if (highlightedElement) {
                    highlightedElement.style.border = '';
                }
                highlightedElement = currentDropTarget as HTMLElement;
                highlightedElement!.style.border = '3px solid #FF8A80';
            }
        } else {
            if (highlightedElement) {
                highlightedElement.style.border = '';
                highlightedElement = null;
            }
        }

    }

    // handle the event when the touch ends
    function handleTouchEnd(event: TouchEvent) {
        node.removeEventListener('touchmove', handleTouchMove);
        node.removeEventListener('touchend', handleTouchEnd);

        // image tag drop target
        const dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        if (!(dropTarget && dropTarget.tagName === 'IMG')) {
            setTimeout(() => {
                resetDraggableStyles();
            }, 0);
        } else {
            draggableStyleOnSnap(dropTarget);
        }
    }

    // reset draggable nodes styling
    function resetDraggableStyles() {
        node.style.position = '';
        node.style.zIndex = '';

        node.style.backgroundColor = originalBackgroundColor;
        node.style.borderRadius = originalBorderRadius;
        node.style.border = '';
        node.style.width = `${originalWidth}px`;
    }

    // apply styles to draggable ndoe
    function draggableStyleOnSnap(dropTarget: Element) {
        const rect = dropTarget.getBoundingClientRect();

        node.style.left = `${rect.left + 3}px`;
        node.style.top = `${rect.bottom - node.offsetHeight - 6}px`;
        node.style.backgroundColor = '#fffffff1';
        node.style.borderRadius = '0';
        node.style.border = '2px solid black';
        node.style.width = `${originalWidth - 15}px`;
        if (highlightedElement) highlightedElement.style.border = '';
    }

    // handle touch start
    node.addEventListener('touchstart', handleTouchStart);

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchStart);
            node.removeEventListener('touchmove', handleTouchMove);
            node.removeEventListener('touchend', handleTouchEnd);
        }
    }
}
