import axios from "axios";
import { Request, Response } from "express";
import { formatResponse } from "../util/util";
import { GooglePlaceDetailsResponse } from "../interface/AddresApi";
import { Comuna } from "../models";
import { list } from "./crudController";


const apyKey = process.env.MAP_KEY;
export const autocomplete = async (req: Request, res: Response):Promise<void> => {
    const { textInput } = req.params;
    const apiUrlAutocomplete = `https://places.googleapis.com/v1/places:autocomplete`;
    try {
        const body = {
            input: textInput,
            locationRestriction: {
                rectangle: {
                    low: {
                        latitude: -33.7,
                        longitude: -71.0
                    },
                    high: {
                        latitude: -33.3,
                        longitude: -70.4
                    }
                }
            }
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apyKey
        }

        const { data } = await axios.post(apiUrlAutocomplete, body, { headers });
        res.status(200).json(formatResponse(true, data,'seggestions api google map', false));


    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

export const detailAddres = async (req: Request, res: Response):Promise<void> => {
    const { placeId } = req.params;
    const uriDetail = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apyKey}&fields=formatted_address,geometry,address_components`;
    try {
        const {data}= await axios.get<GooglePlaceDetailsResponse>(uriDetail);
        const result = data.result;
        
    // 📍 Dirección completa
    const addres = result.formatted_address;

    // 🏘️ Comuna (locality)
    const comuna = result.address_components.find(c =>
      c.types.includes('administrative_area_level_3')
    )?.long_name;

    const streetNumber = result.address_components.find(c =>
      c.types.includes('street_number')
    )?.long_name;
    const streetName = result.address_components.find(c =>
      c.types.includes('route')
    )?.long_name;
    // 🌐 Coordenadas
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    const response={
        addres,
        comuna,
        streetNumber,
        streetName,
        lat,
        lng
    }
        res.status(200).json(formatResponse(true,response,"details api google maps", false));
    } catch (error) {
        console.log(error);
        res.status(500).json({error})
    }
}

