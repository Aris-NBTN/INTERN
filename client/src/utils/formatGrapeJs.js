
export const formatMasonryHTML = (data) => {
    return data.img.map((item, index) => (
        `<div key="${index}" id="${item.idImg}" class="grid-item grid-item--width${item.width}" style="aspect-ratio: ${item.aspectRatio};">
            <a class="w-full h-full" href="${item.link || '#'}">
                <img class="w-full h-full" src="${item.imgSrc}" />
            </a>
        </div>`
    )).join('');
};