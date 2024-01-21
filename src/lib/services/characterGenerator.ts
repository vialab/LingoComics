let appearance = "";
let personality = "";
let background = "";
let clothing = "";

function randomAge(): number {
    const minAge = 15;
    const maxAge = 45;
    
    return Math.floor(Math.random() * (maxAge - minAge + 1) + minAge)
}

function randomGender(): number {
    const max = 2;
    return Math.floor(Math.random() * max);
}

function randomHairColor() {
    const hairColors = ['black', 'white', 'ashy', 'blond', 'red', 'brown'];
    const allHairColors = hairColors.length;
    const hairColor = Math.floor(Math.random() * allHairColors);
    return hairColors[hairColor];
}

function randomClothingStyle() {
    const colors = ['black', 'white', 'red', 'yellow', 'blue'];
    const allClotheColor = colors.length;
    const clotheColor = Math.floor(Math.random() * allClotheColor);
    return colors[clotheColor];
}

// generate random character based on specifications
export function generateCharacterAttributes(): string {
    const character = {
        age: randomAge(),
        gender: randomAge() === 0 ? 'female' : 'male',
        hairColor: randomHairColor(),
        clothingStyle: randomClothingStyle()
    }

    return `A ${character.age}-year-old ${character.gender} with ${character.hairColor} hair and dressed in ${character.clothingStyle} clothing style.`;
}