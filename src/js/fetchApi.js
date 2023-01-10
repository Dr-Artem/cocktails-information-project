import axios from 'axios';

export async function fetchApi(type, identificator, drink) {
    try {
        const response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/${type}.php?${identificator}${drink}`
        );
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
