import { useToast } from '@chakra-ui/react';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	SavedCityType,
	WeatherContextProps,
	WeatherContextProviderProps
} from 'shared/@types/WeatherContext';
import { CityResponseType } from 'shared/@types/WeatherResponse';
import weatherApi from 'shared/services/weather';

const WeatherContext = createContext({} as WeatherContextProps);

const WeatherContextProvider = ({ children }: WeatherContextProviderProps) => {
	const navigate = useNavigate();

	const toast = useToast();

	// Saved Cities
	const [cities, setCities] = useState<SavedCityType[]>([]);

	// Use Effect to get cities from local storage
	useEffect(() => {
		const savedCities = localStorage.getItem('cities');

		if (savedCities) {
			setCities(JSON.parse(savedCities));
		} else {
			const defaultCity: SavedCityType = {
				name: 'Moscow',
				country: 'RU',
				coordinates: {
					lat: 55.755833,
					long: 37.617222
				}
			};

			// Save on state and local storage
			setCities([defaultCity]);
			localStorage.setItem('cities', JSON.stringify([defaultCity]));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('cities', JSON.stringify([...cities]));
	}, [cities]);

	const addCity = async (city: Omit<SavedCityType, 'coordinates'>) => {
		try {
			if (
				cities.filter(
					(savedCity) =>
						savedCity.name.includes(city.name) && savedCity.country === city.country
				).length > 0
			) {
				throw new Error('City already exists');
			}

			// Get coordinates to new city
			const { data } = await weatherApi.get<CityResponseType>('geo/1.0/direct', {
				params: {
					limit: 1,
					q: `${city.name},${city.country}`
				}
			});

			// Storage new city
			setCities((prevState) => [
				...prevState,
				{
					...city,
					coordinates: {
						lat: data[0].lat,
						long: data[0].lon
					}
				}
			]);
		} catch (error: any) {
			return Promise.reject(error);
		}
	};

	const removeCity = (city: SavedCityType) => {
		setCities((prevState) => {
			const cityToRemove = prevState.filter(
				(savedCity) =>
					savedCity.name.includes(city.name) && savedCity.country == city.country
			);

			if (cityToRemove.length === 0) {
				throw new Error('This city not belongs to your tracked cities!');
			}

			return prevState.filter((city) => city !== cityToRemove[0]);
		});

		toast({
			description: `City removed successfully!`,
			status: 'success',
			isClosable: true
		});

		// Redirect user to home page
		navigate('/');
	};

	return (
		<WeatherContext.Provider value={{ cities, addCity, removeCity }}>
			{children}
		</WeatherContext.Provider>
	);
};

export { WeatherContext, WeatherContextProvider };
