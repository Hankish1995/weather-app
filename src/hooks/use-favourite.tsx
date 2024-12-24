import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface FavouriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavourite() {
  const [favourites, setFavourites] = useLocalStorage<FavouriteCity[]>(
    "favorites",
    []
  );

  const queryClient = useQueryClient();

  const favouriteQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favourites,
    initialData: favourites,
    staleTime: Infinity,
  });

  const addToFavourite = useMutation({
    mutationFn: async (city: Omit<FavouriteCity, "id" | "addedAt">) => {
      const newFavourite: FavouriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };
      const exist = favourites.some((fav) => fav.id === newFavourite.id);
      if (exist) {
        throw new Error("City already exists in favourites");
      }
      const newFavourites = [...favourites, newFavourite].slice(0, 10);
      setFavourites(newFavourites);
      return newFavourites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const removeFavourite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavourite = favourites.filter((city) => city.id !== cityId);
      setFavourites(newFavourite);
      return newFavourite;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  return {
    favourites: favouriteQuery.data ?? [],
    addToFavourite,
    removeFavourite,
    isFavourite: (lat: number, lon: number) =>
      favourites.some((city) => city.lat === lat && city.lon === lon),
  };
}
