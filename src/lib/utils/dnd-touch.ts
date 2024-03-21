import { dragAssociationPairs } from "$lib/stores/dragStore";
import { get } from "svelte/store";
import type { DragPair, TouchDraggableOptions } from "../../utils/types";

export function touchDraggable(node: HTMLElement, options: TouchDraggableOptions) {
    let highlightedElement : HTMLElement | null = null;
    let lastImageElement : HTMLElement | null = null;
    let lastPairX : string = '';
    let lastPairY : string = '';
    let dragPairs: DragPair[] = get(dragAssociationPairs);

    const originalX : string = node.style.left;
    const originalY : string = node.style.top;

    const originalWidth : number = node.offsetWidth;
    const originalBackgroundColor : string = node.style.backgroundColor;
    const originalBorderRadius : string = node.style.borderRadius;

    node.style.transition = 'all 0.5s ease';

    let clone : HTMLElement | null = null;
    
    // handle the event when the user starts touching
    function handleTouchStart() {
        // clone = document.createElement('div'); // Create a new div element
        // // Style the dummy div as needed, here are some example styles
        // clone.style.width = `${node.offsetWidth}px`;
        // clone.style.height = `${node.offsetHeight}px`;
        // clone.style.position = 'absolute';
        // clone.style.left = node.style.left; // Position the dummy at the same place as the node
        // clone.style.top = node.style.top;
        // clone.style.backgroundColor = '#f0f0f0'; // Example background color, adjust as necessary
        // clone.style.border = '1px dashed #ccc'; // Example border, adjust as necessary
        // clone.innerText = node.innerText;
        // clone.style.padding = '3px';
        // clone.className = 'dummy-div'; // Assign a class for further styling or identification

        // // Insert the dummy div right before the node in the node's parent
        // node.before(clone);

        // lastImageElement?.classList.remove("pair");

        node.style.width = `${originalWidth}px`;
        node.style.borderRadius = originalBorderRadius;
        node.style.position = 'fixed';
        node.style.zIndex = '1000';

        node.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
        node.style.transform = 'scale(0.95)';
        node.style.backgroundColor = '#e0e0e0';

        node.addEventListener('touchmove', handleTouchMove);
        node.addEventListener('touchend', handleTouchEnd);
    }

    // handle the event when the user is dragging the element
    function handleTouchMove(event: TouchEvent) {
        event.preventDefault();

        // no transition when moving
        node.style.transition = '';

        const touch = event.touches[0];
        const newX = touch.clientX;
        const newY = touch.clientY;

        node.style.left = `${newX}px`;
        node.style.top = `${newY}px`;

        // determine the element currently under the drag (for highlighting)
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
        node.style.transition = 'all 0.5s ease';
        node.removeEventListener('touchmove', handleTouchMove);
        node.removeEventListener('touchend', handleTouchEnd);

        // image tag drop target
        const dropTarget = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

        // check if pair exists
        let dragPairs = get(dragAssociationPairs);
        let pairExists = dragPairs.some(pair => pair.target.dataset.id === (dropTarget as HTMLElement).dataset.id);
        let pairExists2 = dragPairs.some(pair => pair.target.dataset.id === node.dataset.id);

        if (pairExists) {
            let swapNode = dragPairs.find(pair => pair.target.dataset.id === (dropTarget as HTMLElement).dataset.id);
            if (swapNode) {
                node.style.left = lastPairX;
                node.style.top = lastPairY;
            }
        } else if (dropTarget && dropTarget.tagName === 'IMG') {
            // check if correct match
            draggableStyleOnSnap(dropTarget);
            options.addPair({ draggable: node, target: dropTarget as HTMLElement });
            dropTarget.classList.add('pair');
            lastPairX = node.style.left;
            lastPairY = node.style.top;
            lastImageElement = dropTarget as HTMLElement;
        } else {
            // reset <li> to <ul> (default position)
            resetDraggableStyles();
            dropTarget?.classList.remove('pair');
            options.removePair({ draggable: node, target: dropTarget as HTMLElement });
        }
    }

    // reset draggable nodes styling
    function resetDraggableStyles() {
        node.style.position = '';
        node.style.left = `${originalX}px`;
        node.style.top = `${originalY}px`;
        node.style.zIndex = '';

        node.style.backgroundColor = originalBackgroundColor;
        node.style.borderRadius = originalBorderRadius;
        node.style.border = '';
        node.style.transform = 'scale(1.0)'
        node.style.width = `${originalWidth}px`;   

        if (clone) {
            clone.remove();
            clone = null;
        }
    }

    // apply styles to draggable ndoe
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

    function handleSwap(targetId: string, swapId: string): void {
        dragAssociationPairs.update(pairs => {
            let pair1 = pairs.find(pair => pair.draggable.dataset.id === targetId);
            let pair2 = pairs.find(pair => pair.draggable.dataset.id === swapId);

            if (pair1 && pair2) {
                const temp = pair1.draggable;
                pair1.draggable = pair2.draggable;
                pair2.draggable = temp;
            }
            return pairs;
        });
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