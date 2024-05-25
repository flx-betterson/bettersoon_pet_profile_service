export const  getBirthdateFromAge=(age)=> {
    // Get today's date
    const today = new Date();

    // Calculate the birth year
    const birthYear = today.getFullYear() - age;

    // Return the birth date in the format "01.01.yyyy"
    return `01.01.${birthYear}`;
}